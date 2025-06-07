import { OrderStatus } from '../config';
import {fetchOrders, fetchOrdersCount} from '../../../services/order/orderList';
import { cosThumb } from '../../../utils/util';

Page({
  page: {
    size: 10,
    num: 1,
  },
  data: {
    tabs: [
      { key: -1, text: '全部' },
      { key: OrderStatus.PENDING_PAYMENT, text: '待确认', info: '' },
      { key: OrderStatus.PENDING_DELIVERY, text: '进行中', info: '' },
      { key: OrderStatus.PENDING_RECEIPT, text: '待完成', info: '' },
      { key: OrderStatus.COMPLETE, text: '已完成', info: '' },
    ],
    curTab: -1,
    orderList: [],
    listLoading: 0,
    pullDownRefreshing: false,
    emptyImg: 'https://xinxinji.cn/miniapp/empty-order-list.jpg',
    backRefresh: false,
    status: -1,
  },
 /**
   * 生命周期函数--监听页面加载
   */
  onLoad(query: any) {
    let status = parseInt(query.status);
    status = this.data.tabs.map((t) => t.key).includes(status) ? status : -1;
    this.init(status);
    this.pullDownRefresh = this.selectComponent('#wr-pull-down-refresh');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (!this.data.backRefresh) return;
    this.onRefresh();
    this.setData({ backRefresh: false });
  },

  init(status: any) {
    status = status !== undefined ? status : this.data.curTab;
    this.setData({status});
    this.refreshList(status);
  },
  /**
   * 页面上拉触底事件的处理函数,监听用户上拉触底事件。
   * @param event 
   */
  onReachBottom(event: any) {
    if (this.data.listLoading === 0) {
      this.getOrderList(this.data.curTab);
    }
  },
  /**
   * 滚动条滚动事件触发.
   * @param event 
   */
  onPageScroll(event: any) {
   // this.pullDownRefresh && this.pullDownRefresh.onPageScroll(e);
    if (this.data.listLoading === 0) {
      this.getOrderList(this.data.curTab);
    }
  },
  /**
   * 自定义tab下拉刷新.
   * @param event 
   */
  onCustomPullDownRefresh(event: any) {
    const callback  = event.detail;
    this.setData({ pullDownRefreshing: true });
    this.refreshList(this.data.curTab).then(() => {
        this.setData({ pullDownRefreshing: false });
        wx.stopPullDownRefresh();
        callback && callback();
    })
    .catch((err) => {
      this.setData({ pullDownRefreshing: false });
      wx.stopPullDownRefresh();
      Promise.reject(err);
    });
  },

  onScrolltolower(event: any) {
    if (this.data.listLoading === 0) {
      this.getOrderList(this.data.curTab);
    }
  },
  /**
   *切换tab页.
   * @param event.
   */
  onTabChange(event: any) {
    const { value } = event.detail;
    this.setData({status: value});
    this.refreshList(value);
  },
  /**
   * 获取订单列表.
   * @param statusCode 
   * @param reset 
   */
  getOrderList(statusCode = -1, reset = false) {
    const params = {parameter: {pageSize: this.page.size,pageNum: this.page.num, orderStatus: -1}};
    if (statusCode !== -1) {
      params.parameter.orderStatus = statusCode;
    }
    this.setData({ listLoading: 1 });
    return fetchOrders(params).then((res: any) => {
        if (this.page.num == 1) {
          this.getOrdersCount();
        }
        this.page.num++;
        let orderList : any = [];
        if (res && res.data && res.data.data) {
          orderList = (res.data.data || []).map((order: any) => {
            return {
              id: order.orderId,
              orderNo: order.orderNo,
              parentOrderNo: order.parentOrderNo,
              storeId: order.storeId,
              storeName: order.storeName,
              status: order.orderStatus,
              statusDesc: order.orderStatusName,
              amount: order.paymentAmount,
              totalAmount: order.totalAmount,
              logisticsNo: order.logisticsVO.logisticsNo,
              createTime: order.createTime,
              goodsList: (order.orderItemVOs || []).map((goods: any) => ({
                id: goods.id,
                thumb: cosThumb(goods.goodsPictureUrl, 70),
                title: goods.goodsName,
                skuId: goods.skuId,
                spuId: goods.spuId,
                specs: (goods.specifications || []).map((spec: any) => spec.specValue),
                price: goods.tagPrice ? goods.tagPrice : goods.actualPrice,
                num: goods.buyQuantity,
                titlePrefixTags: goods.tagText ? [{ text: goods.tagText }] : [],
              })),
              buttons: order.buttonVOs || [],
              groupInfoVo: order.groupInfoVo,
              freightFee: order.freightFee,
            };
          });
        }
        return new Promise((resolve: any) => {
          if (reset) {
            this.setData({ orderList: [] }, () => 
              resolve()
            );
          } else {
            resolve();
          }
        }).then(() => {
          this.setData({orderList: this.data.orderList.concat(orderList), listLoading: orderList.length > 0 ? 0 : 2});
        });
      }).catch((err: any) => {
        this.setData({ listLoading: 3 });
        return Promise.reject(err);
      });
  },
  /**
   * 获取订单总记录数.
   * @param params 
   */
  getOrdersCount(params: any) {
    return fetchOrdersCount(params).then((res: any) => {
      const tabsCount = res.data || [];
      const { tabs } = this.data;
      tabs.forEach((tab: any) => {
        const tabCount = tabsCount.find((c: any) => c.tabType === tab.key);
        if (tabCount) {
          tab.info = tabCount.orderNum;
        }
      });
      this.setData({ tabs });
    });
  },
  /**
   * 重试获取订单列表.
   * @param event 
   */
  onReTryLoad(event: any) {
    this.getOrderList(this.data.curTab);
  },
  /**
   * 刷新重置查询条件信息.
   * @param status 
   */
  refreshList(status = -1) {
    this.page = { size: this.page.size,num: 1};
    this.setData({ curTab: status, orderList: [] });
    return Promise.all([
      this.getOrderList(status, true)
    ]);
  },
  /**
   * 页面刷新事件.
   */
  onRefresh() {
    this.refreshList(this.data.curTab);
  },
  /**
   * 返回退出界面.
   */
  onBack() {
    wx.navigateBack({ delta: 1 });
  },

  onOrderCardTap(e: any) {
    const { order } = e.currentTarget.dataset;
    wx.navigateTo({url: `/pages/order/order-detail/index?id=${order.id}`});
  }
});
