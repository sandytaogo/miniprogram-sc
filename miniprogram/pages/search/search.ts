// pages/search/search.ts
import config from '../../config/env'
let app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchPlaceholder: app.globalData.other.searchPlaceholder || '',
    searchValue : '',
    historyWords : ['家政'],
    popularWords: []
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
    wx.request({
      url: config.domain + '/stock/shopsearch/history',
      method:"GET",
      success:(res: any) => {
        if (res.data) {
          this.setData({popularWords: res.data});
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 获取搜索焦点事件.
   * @param params 
   */
  onSearchFocus: function(event:any) {
    const { value } = event.detail;
    this.triggerEvent('focus', { value });
  },

  /**
   * 清除历史缓存.
   */
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

  /**
   * 处理历史搜索事件.
   * @param event 
   */
  handleHistoryTap:function(event: any) {
    let { index } = event.currentTarget.dataset;
    this.data.searchValue = this.data.historyWords[index];
    this.navToSearchPage(event);
  },

  /**
   * 处理热门搜索事件.
   * @param event 
   */
  handleHotTap:function(event: any) {
    let { index } = event.currentTarget.dataset;
    this.data.searchValue = this.data.popularWords[index];
    this.navToSearchPage(event);
  },

  /**
   * 搜索提交处理事件.
   * @param event 
   */
  handleSearchSubmit:function (event: any) {
    let { value } = event.detail;
    this.data.searchValue = value;
    this.navToSearchPage(event);
  },
  /**
   * 跳转搜索结果页面.
   * @param event 
   */
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
