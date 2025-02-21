// pages/service/voice.ts
var recorderManager = wx.getRecorderManager()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    round: true,
    popGestureDirection: 'vertical',
    range: ['horizontal', 'vertical', 'multi'],
    content: "",
    record:false,
    poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
    name: '语音测试',
    author: '测试',
    src: '',
  },
  recordStart:function () {
    let options = {}
    recorderManager.start(options)
    this.setData({content:"开始录制..."})
    
  },
  recordCancel:function () {
    this.setData({content:"取消录制..."})
  },
  recordStop:function () {
    this.setData({content:""})
    recorderManager.stop()
    recorderManager.onStop((res)=> {
      let formData = {
        filePath : res.tempFilePath
      }
      this.setData({src:formData.filePath})
    })
  },
  audioPlay: function () {
    this.audioCtx.play()
  },
  audioPause: function () {
    this.audioCtx.pause()
  },
  audio14: function () {
    this.audioCtx.seek(14)
  },
  audioStart: function () {
    this.audioCtx.seek(0)
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
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    wx.getRecorderManager()
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