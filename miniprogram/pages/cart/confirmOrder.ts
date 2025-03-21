// pages/cart/confirmOrder.ts
import env from '../../config/env'

import util  from '../../utils/util'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    checkedGoodsList: [],
    checkedAddress: {id:0},
    checkedCoupon: [],
    couponList: [],
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00,    //快递费
    couponPrice: 0.00,     //优惠券的价格
    orderTotalPrice: 0.00,  //订单总价
    actualPrice: 0.00,     //实际需要支付的总价
    addressId: 0,
    couponId: 0
  },

  submitOrder:function() {
    if (this.data.checkedAddress == null || this.data.checkedAddress.id == null || this.data.checkedAddress.id <= 1) {
      wx.showToast({title: '请填写地址！',icon: 'error', duration: 3000})
      return;
    }
    console.log('提交订单')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

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
    wx.showLoading({title: '加载中...'})
    wx.request({
      url: env.domain + '/stock/cart/list', // 替换为你的接口地址
      data: {
        t:Date.now()
      },
      success: (res: any) => {
        wx.hideLoading(); // 隐藏加载提示
        this.setData({checkedGoodsList: res.data.rows})
      },
      fail: (err) => {
        wx.hideLoading(); // 请求失败也隐藏加载提示
        console.error('数据加载失败:', err);
      }
    });
    this.setData({checkedAddress:{id:0}})

    console.log(util)
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