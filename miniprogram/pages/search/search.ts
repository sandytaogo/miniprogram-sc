// pages/search/search.ts
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchPlaceholder: app.globalData.other.searchPlaceholder || '',
    searchValue : '',
    historyWords : ['鸡','电脑','iPhone12','车载手机支架','自然堂','小米10','原浆古井贡酒','欧米伽','华为','针织半身裙', '氢跑鞋','三盒处理器'],
    popularWords: ['鸡', '电脑','iPhone12', '车载手机支架','自然堂','小米10','原浆古井贡酒', '欧米伽','华为', '针织半身裙', '氢跑鞋','三盒处理器']
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

  },

  handleClearHistory() {
    console.log('清除缓存...')
  },
  /**
   * 搜索输入事件.
   * @param event 
   */
  onSearchInputEvent(event: any) {
    let searchValue = event.detail.value;
    this.data.searchValue = searchValue;
  },

  navToSearchPage:function(event:any) {
    if (event && this.data.searchValue == '') {
      return;
    }
    wx.navigateTo({url: '/pages/goods/result/index?searchValue=' + this.data.searchValue + ''});
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
