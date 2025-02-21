// pages/shop/shop.ts
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    shop: {name:''},
    gallery: [],
    attribute: [],
    issueList: [],
    comment: [{}],
    brand: {},
    nbLoading: "加载中...",
    specificationList: [],
    productList: [],
    relatedGoods: [],
    cartGoodsCount: 0,
    userHasCollect: 0,
    number: 1,
    checkedSpecText: '请选择规格数量',
    openAttr: false,
    noCollectImage: "/images/icon_collect.png",
    hasCollectImage: "/images/icon_collect_checked.png",
    collectBackImage: "/images/icon_collect.png"
  },
  switchAttrPop:function() {
    console.log('switchAttrPop')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
   this.setData({id: options.id})
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
    wx.showLoading({ title: '加载中...' }); // 显示加载提示
    var app = getApp()
    wx.request({
      url: 'https://xinxinji.cn/stock/shop/detail', // 替换为你的接口地址
      data: {
        shopId:this.data.id,
        lng:app.globalData.longitude ? app.globalData.longitude : '', 
        lat:app.globalData.latitude ? app.globalData.latitude : ''
      },
      success: (res: any) => {
        wx.hideLoading(); // 隐藏加载提示
        let data = res.data
        this.setData({shop: res.data, gallery:data.imageList})
      },
      fail: (err) => {
        wx.hideLoading(); // 请求失败也隐藏加载提示
        console.error('数据加载失败:', err);
      }
    });
    this.setData({nbLoading:''})
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