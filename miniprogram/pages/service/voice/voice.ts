// pages/service/voice.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    round: true,
    popGestureDirection: 'vertical',
    range: ['horizontal', 'vertical', 'multi'],
    content: "",
    record:false
  },
  recordStart:function () {
    this.setData({content:"开始录制..."})
  },
  recordCancel:function () {
    this.setData({content:"取消录制..."})
  },
  recordStop:function () {
    this.setData({content:""})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      title: options.title
    })
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