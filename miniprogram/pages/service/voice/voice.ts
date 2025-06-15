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
    record:false,
    poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
    name: '语音测试',
    author: '测试',
    src: '',
    mess: '',
    data: '16:50',
    messages: [
      {id: 1, text: '很高兴为您服务！请问有什么可以帮您。', createdId:0}
    ], //聊天信息
    mineAvatorSrc:'https://tse4-mm.cn.bing.net/th/id/OIP-C.PobTVuzuQy7tAZtvVEc3VQAAAA?rs=1&pid=ImgDetMain',
    himAvatorSrc:'https://tse4-mm.cn.bing.net/th/id/OIP-C.PobTVuzuQy7tAZtvVEc3VQAAAA?rs=1&pid=ImgDetMain',
    inputMessage: '',
    toBottom: '', // 用于控制滚动
    keepFocus: false, // 添加这个数据属性
    scrollTop: 0,
    keyboardHeight: 0,
    fontSizeScale: 1, // 添加字体缩放比例数据
    loading: false,
    pageNum: 1, // 添加页码控制,
    positionTop: 0,
    scrollViewHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    let app = getApp();
    // 初始化字体大小
    this.setData({ fontSizeScale: app.globalData.fontSizeScale,title: options.title});
    setTimeout(() => {
      this.scrollToBottom();
    }, 50);
    // 监听键盘高度变化
    wx.onKeyboardHeightChange((res) => {
      const keyboardHeight = res.height;
      this.setData({ keyboardHeight });
    });
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

  // 滑动到顶部
  handleScrollToupper() {
    if (this.data.loading) return; // 防止重复加载
    this.setData({
      loading: true,
    });
    // 记录当前第一条消息的位置
    const currentFirstMessage = this.data.content[0];
    setTimeout(() => {
      // 模拟获取历史消息
      const historyMessages = [
        {id: 1, text: '这是历史消息1'},
        {id: 0, text: '这是历史消息2'},
        {id: 1,text: '这是历史消息3'},
        {id: 0,text: '这是历史消息4'},
        // ... 更多历史消息
      ];
      this.setData({content: [...historyMessages, ...this.data.content],loading: false,pageNum: this.data.pageNum + 1});
    }, 1000);
  },

  // 发送消息
  sendMess() {
    if (!this.data.inputMessage.trim()) return;
    const newMessage = {id: this.data.messages.length + 1, text: this.data.inputMessage, createdId:123};
    this.setData({
      messages: [...this.data.messages, newMessage],
        inputMessage: '',
        keepFocus: true, // 保持输入框焦点
      },
      () => {
        this.scrollToBottom();
      }
    );
  },
  
  // 添加滚动到底部的方法
  scrollToBottom() {
    this.setData({
      scrollTop: 99999999,
    });
  },
  onFocus() {
    this.scrollToBottom();
  },
  // 输入事件处理
  onInput(event: any) {
    this.setData({
      inputMessage: event.detail.value,
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
    // 页面卸载时移除监听
    wx.offKeyboardHeightChange();
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