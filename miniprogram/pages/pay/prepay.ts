import env from '../../config/env';
import service from '../../services/service';
import { paySuccess } from '../order/order-confirm/pay';
// pages/pay/prepay.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:'',
    orderNo: '',
    payAmt: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    this.setData({orderNo: options.orderNo, payAmt:options.payAmt});
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

  },

/**
 * 加载预付订单.
 * @param event 
 */
 onLoadOrderPrePay(event: any) {
  service.request({
    url: env.domain + '/stock/order/pay',
    method: 'post',
    encipherMode: 4,
    data: {orderNo: this.data.orderNo},
    header: {'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/json'},
    success: (res: any) => {
      if (res.data.code != 200) {
        wx.showToast({icon:'none', title:res.data.msg});
        return;
      }
      //支付成功
      paySuccess({payAmt: this.data.payAmt});
    }
  });
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