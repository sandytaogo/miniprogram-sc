import Toast from 'tdesign-miniprogram/toast/index';
import Dialog from 'tdesign-miniprogram/dialog/index';
import { OrderButtonTypes } from '../../config';

import {completeOrder, cancelOrder} from '../../../../services/order/orderDetail';

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    order: {
      type: Object,
      observer(order) {
        // 判定有传goodsIndex ，则认为是商品button bar, 仅显示申请售后按钮
        if (this.properties?.goodsIndex !== null) {
          const goods = order.goodsList[Number(this.properties.goodsIndex)];
          this.setData({
            buttons: {
              left: [],
              right: (goods.buttons || []).filter((b) => b.type == OrderButtonTypes.APPLY_REFUND),
            },
          });
          return;
        }
        // 订单的button bar 不显示申请售后按钮
        const buttonsRight = (order.buttons || [])
          // .filter((b) => b.type !== OrderButtonTypes.APPLY_REFUND)
          .map((button) => {
            //邀请好友拼团按钮
            if (button.type === OrderButtonTypes.INVITE_GROUPON && order.groupInfoVo) {
              const {
                groupInfoVo: { groupId, promotionId, remainMember, groupPrice },
                goodsList,
              } = order;
              const goodsImg = goodsList[0] && goodsList[0].imgUrl;
              const goodsName = goodsList[0] && goodsList[0].name;
              return {...button, openType: 'share',
                dataShare: {
                  goodsImg,
                  goodsName,
                  groupId,
                  promotionId,
                  remainMember,
                  groupPrice,
                  storeId: order.storeId,
                }
              };
            }
            return button;
          });
        // 删除订单按钮单独挪到左侧
        const deleteBtnIndex = buttonsRight.findIndex((b) => b.type === OrderButtonTypes.DELETE);
        let buttonsLeft = [];
        if (deleteBtnIndex > -1) {
          buttonsLeft = buttonsRight.splice(deleteBtnIndex, 1);
        }
        this.setData({
          buttons: {
            left: buttonsLeft,
            right: buttonsRight,
          },
        });
      },
    },
    goodsIndex: {
      type: Number,
      value: null,
    },
    isBtnMax: {
      type: Boolean,
      value: false,
    },
  },

  data: {
    order: {},
    buttons: {
      left: [],
      right: [],
    },
  },

  methods: {
    // 点击【订单操作】按钮，根据按钮类型分发
    onOrderBtnTap(e) {
      const { type } = e.currentTarget.dataset;
      switch (type) {
        case OrderButtonTypes.DELETE:
          this.onDelete(this.data.order);
          break;
        case OrderButtonTypes.CANCEL:
          this.onCancel(this.data.order);
          break;
        case OrderButtonTypes.CONFIRM:
          this.onConfirm(this.data.order);
          break;
        case OrderButtonTypes.PAY:
          this.onPay(this.data.order);
          break;
        case OrderButtonTypes.APPLY_REFUND:
          this.onApplyRefund(this.data.order);
          break;
        case OrderButtonTypes.VIEW_REFUND:
          this.onViewRefund(this.data.order);
          break;
        case OrderButtonTypes.COMMENT:
          this.onAddComment(this.data.order);
          break;
        case OrderButtonTypes.INVITE_GROUPON:
          //分享邀请好友拼团
          break;
        case OrderButtonTypes.REBUY:
          this.onBuyAgain(this.data.order);
      }
    },
    /**
     * 取消订单.
     */
    onCancel() {
      Dialog.confirm({title: '确认是否取消订单？',content: '', confirmBtn: '确认取消',cancelBtn: '取消'}).then(() => {
        cancelOrder({orderNo: this.data.order.orderNo}).then((res) => {
          if (res.code == 200) {
            wx.navigateBack({delta: 1});
          } else {
            Toast({context: this,selector: '#t-toast',message: res.msg, icon: 'check-circle'});
          }
        });
      }).catch(() => {
        Toast({context: this,selector: '#t-toast',message: '放弃取消了订单',icon: 'check-circle'});
      });
    },
    /**
     * 确认订单.
     */
    onConfirm() {
      Dialog.confirm({title: '确认是否完成订单？',content: '', confirmBtn: '确认完成',cancelBtn: '取消'}).then(() => {
        completeOrder({orderNo: this.data.order.orderNo}).then((res) => {
          if (res.code == 200) {
            wx.navigateBack({delta: 1});
          }
        });
      }).catch(() => {
        Toast({context: this,selector: '#t-toast',message: '你取消了完成订单',icon: 'check-circle'});
      });
    },
    /**
     * 支付处理事件.
     */
    onPay() {
      wx.navigateTo({url: `/pages/pay/prepay?orderNo=${this.data.order.orderNo}&payAmt=${this.data.order.amount}`});
     // Toast({context: this,selector: '#t-toast', message: '你点击了去支付',icon: 'check-circle'});
    },

    /***
     * 再次购买事件.
     */
    onBuyAgain(order) {
      if (order.goodsList && order.goodsList.length > 0) {
        wx.navigateTo({url: `/pages/shop/shop?id=${order.storeId}`});
      } else {
        wx.navigateTo({url: `/pages/shop/shop?id=${order.storeId}`});
      }
     // Toast({ context: this,selector: '#t-toast',message: '你点击了再次购买', icon: 'check-circle' });
    },

    onApplyRefund(order) {
      const goods = order.goodsList[this.properties.goodsIndex];
      const params = {
        orderNo: order.orderNo,
        skuId: goods?.skuId ?? '19384938948343',
        spuId: goods?.spuId ?? '28373847384343',
        orderStatus: order.status,
        logisticsNo: order.logisticsNo,
        price: goods?.price ?? 89,
        num: goods?.num ?? 89,
        createTime: order.createTime,
        orderAmt: order.totalAmount,
        payAmt: order.amount,
        canApplyReturn: true,
      };
      const paramsStr = Object.keys(params).map((k) => `${k}=${params[k]}`).join('&');
      wx.navigateTo({ url: `/pages/order/apply-service/index?${paramsStr}` });
    },
    /**
     * 退款处理事件.
     */
    onViewRefund() {
      Toast({ context: this,selector: '#t-toast',message: '你点击了查看退款',icon: ''});
    },

    /** 
     * 添加订单评论 
     */
    onAddComment(order) {
      const skuId = order?.goodsList?.[0]?.skuId;
      const imgUrl = order?.goodsList?.[0]?.thumb;
      const title = order?.goodsList?.[0]?.title;
      const specs = order?.goodsList?.[0]?.specs;
      ///&imgUrl=${imgUrl}
      wx.navigateTo({
        url: `/pages/goods/comments/create/index?orderNo=${order?.orderNo}&specs=${specs}&title=${title}&storeId=${order.storeId}&goodsId=${skuId}`
      });
    }
  }
});
