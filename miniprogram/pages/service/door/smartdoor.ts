// pages/service/door/smartdoor.ts
import config from '../../../config/env'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcodeUrl: ''
  },
  /**
   * 请求二维码.
   */
  onReuqestQrcode(event:any) {
    if (event) {

    }
    this.setData({qrcodeUrl: config.domain + '/stock/smartdoor/qrcode?t=' + Date.now()})
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
    this.onReuqestQrcode({});
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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