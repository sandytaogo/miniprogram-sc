// pages/cart/confirmOrder.ts
import env from '../../../config/env';
import { fetchSettleDetail, dispatchCommitPay } from '../../../services/order/orderConfirm';
import { getAddressPromise } from '../../user/address/list/util';
import util  from '../../../utils/util';
import { commitPay, wechatPayOrder } from './pay';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    goodsRequestList:[],
    checkedGoodsList: [],
    userAddress: null as any,
    checkedAddress: {id:0},
    couponList: [],
    checkedCoupon: [],
    storeInfoList:[],
    noteInfo: [] as any,
    tempNoteInfo: [] as any ,
    settle: { }, //结算数据.
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00,    //快递费
    couponPrice: 0.00,     //优惠券的价格
    totalAmount: 0.00,  //订单总价
    actualPrice: 0.00,     //实际需要支付的总价
    addressId: 0,
    couponId: 0
  },
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    this.options = options;
    this.handleOptionsParams(options, []);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 页面显示
  },
  /**
   * 刷新页面.
   */
  onRefresh () {
    this.handleOptionsParams(this.options, []);
  },
  /**
   * 选择订单地址.
   * @param event.
   */
  selectAddress: function(event: any) {
    /** 获取一个Promise */
    getAddressPromise().then((address: any) => {
      this.handleOptionsParams({userAddress: { ...address, checked: true }}, []);
    }).catch(() => {});
    const { userAddress} = this.data; // 收货地址
    let id = '';
    if (userAddress && userAddress.id) {
      id = `&id=${userAddress.id}`;
    }
    wx.navigateTo({url: `/pages/user/address/list/index?selectMode=1&isOrderSure=1${id}`});
  },

  /**
   * 处理不同情况下跳转到结算页时需要的参数
   */ 
  handleOptionsParams(options: any, couponList: any) {
    let { goodsRequestList } = this.data; // 商品列表
    let { userAddress } = this.data; // 收货地址
    const storeInfoList:any = [] ; // 门店列表
    let goodsRequestListJson = null;
    // 如果是从地址选择页面返回，则使用地址显选择页面新选择的地址去获取结算数据
    if (options.userAddress) {
      userAddress = options.userAddress;
    }
    if (options.type === 'cart') {
      // 从购物车跳转过来时，获取传入的商品列表数据
      goodsRequestListJson = wx.getStorageSync('order.goodsRequestList');
      if (goodsRequestListJson) {
        goodsRequestList = JSON.parse(goodsRequestListJson);
      }
    } else if (options.type === 'shop') { 
      goodsRequestListJson = wx.getStorageSync('shop.goodsRequestList');
      if (goodsRequestListJson) {
        goodsRequestList = JSON.parse(goodsRequestListJson);
      }
    } else if (typeof options.goodsRequestList === 'string') {
      goodsRequestList = JSON.parse(options.goodsRequestList);
    }
    //获取结算页请求数据列表
    const storeMap: any = {};
    goodsRequestList.forEach((goods: any) => {
      if (!storeMap[goods.storeId]) {
        storeInfoList.push({storeId: goods.storeId, storeName: goods.storeName});
        storeMap[goods.storeId] = true;
      }
    });
    this.data.goodsRequestList = goodsRequestList;
    this.data.storeInfoList = storeInfoList;
    const params = {goodsRequestList, storeInfoList, userAddress, couponList};
    fetchSettleDetail(params).then((res: any) => {
        this.setData({loading: false, goodsRequestList: goodsRequestList});
        this.initData(res.data);
      },(err: any) => {
        //接口异常处理
        console.error(err);
        this.handleError();
      },
    );
  },

  handleResToGoodsCard(data: any) {
    // 转换数据 符合 goods-card展示
    const orderCardList:any = []; // 订单卡片列表
    let storeInfoList:any = [];
    const submitCouponList:any = []; //使用优惠券列表;
    data.storeGoodsList && data.storeGoodsList.forEach((ele: any) => {
      const orderCard = { id: ele.storeId,storeName: ele.storeName, status: 0, statusDesc: '', 
        amount: ele.storeTotalPayAmount, goodsList: [] as any
      }; // 订单卡片
      ele.skuDetailVos.forEach((item: any, index: number) => {
        orderCard.goodsList.push({
          id: index,
          thumb: item.image,
          title: item.goodsName,
          specs: item.skuSpecLst.map((s:any) => s.specValue), // 规格列表 string[]
          price: item.tagPrice || item.settlePrice || '0', // 优先取限时活动价
          settlePrice: item.settlePrice,
          titlePrefixTags: item.tagText ? [{ text: item.tagText }] : [],
          num: item.quantity,
          skuId: item.skuId,
          spuId: item.spuId,
          storeId: item.storeId,
        });
      });
      storeInfoList.push({storeId: ele.storeId,storeName: ele.storeName, remark: ''});
      submitCouponList.push({storeId: ele.storeId,couponList: ele.couponList || []});
      this.data.noteInfo.push('');
      this.data.tempNoteInfo.push('');
      orderCardList.push(orderCard);
    });

    if (data.storeGoodsList == undefined) {
      storeInfoList = data.storeInfoList;
    }
    this.setData({ orderCardList, storeInfoList, submitCouponList });
    return data;
  },
  /**
   * 初始化...
   * @param resData 初始化数据. 
   */
  initData(initData: any) {
    // 转换商品卡片显示数据
    const data = this.handleResToGoodsCard(initData);
    this.data.userAddress = initData.userAddress;
    if (initData.userAddress) {
      this.setData({ userAddress: initData.userAddress });
    }
    this.setData({settle: data});
    this.isInvalidOrder(data);
  },
  /**
   * 检查是否未无效订单信息.
   * @param data 数据.
   */
  isInvalidOrder(data: any) {
    // 失效 不在配送范围 限购的商品 提示弹窗
    if (
      (data.limitGoodsList && data.limitGoodsList.length > 0) 
      || (data.abnormalDeliveryGoodsList && data.abnormalDeliveryGoodsList.length > 0) 
      || (data.inValidGoodsList && data.inValidGoodsList.length > 0)
    ) {
      this.setData({ popupShow: true });
      return true;
    }
    this.setData({ popupShow: false });
    if (data.settleType === 0) {
      return true;
    }
    return false;
  },
  /**
   * 处理错误订单.
   */
  handleError() {
    wx.showToast({icon: 'none', title: '结算异常, 请稍后重试'});
    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
    this.setData({loading: false});
  },

  /**
   * 提交订单
   */
  submitOrder:function() {
    let { goodsRequestList, settle, storeInfoList, couponList } = this.data; //订单信息.
    let { userAddress } = this.data; // 收货地址
    if (userAddress == null || userAddress.id == null || userAddress.id <= 1) {
      wx.showToast({title: '请填写地址！', icon: 'none', duration: 3000})
      return;
    }
    const params = {goodsRequestList, storeInfoList, userAddress, couponList};
    dispatchCommitPay(params).then((res: any) => {
        if (res.code == 200) {
          this.handlePay(res.data, settle);
        } else {
          wx.showToast({title: res.msg, icon: 'none', duration: 3000})
        }
      },() => {
        //接口异常处理
        this.handleError();
      },
    );
  },

  /**
   * 处理支付
   */ 
  handlePay(data: any, settleDetailData: any) {
    const { channel, payInfo, tradeNo, interactId, transactionId } = data;
    const { totalAmount, totalPayAmount } = settleDetailData;
    const payOrderInfo = {
      payInfo: payInfo,
      orderId: tradeNo,
      orderAmt: totalAmount,
      payAmt: totalPayAmount,
      interactId: interactId,
      tradeNo: tradeNo,
      transactionId: transactionId,
    };

    if (channel == undefined || channel === 'wechat') {
      //todo method...
        wx.navigateTo({url: `/pages/pay/prepay?payAmt=${data.totalPayAmount}&orderNo=${data.orders[0].orderNo}`});
      //wechatPayOrder(payOrderInfo);
    }
  },
  /**
   * 返回事件.
   */
  onBack () {
    wx.navigateBack({ delta: 1 });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})