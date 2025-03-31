// pages/shop/map.ts

let map_mark =  {id: 1, latitude: 22.2655998353, longitude: 113.322520, iconPath: '/images/location.png', width:'100rpx',height:'100rpx',
  // callout: {
  //   content: '文本内容',
  //   color: '#ff0000',
  //   fontSize: 14,
  //   borderWidth: 2,
  //   borderRadius: 10,
  //   borderColor: '#000000',
  //   bgColor: '#fff',
  //   padding: 5,
  //   display: 'ALWAYS',
  //   textAlign: 'center'
  // }
    label: {
    content: 'label 文本',
    fontSize: 14,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 5,
    bgColor: '#fff',
    padding: 5
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 23.096994,
    longitude: 113.324520,
    markers: [{id:1,latitude: 22.2655998353, longitude: 113.322520, width:'100rpx',height:'100rpx'}],
    customCalloutMarkerIds: [],
    num: 1,
    back_btn_icon:'/images/detail_back.png'
  },
  toBackPage:function(e:any) {
    wx.navigateBack({})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options:any) {
    if (options.name) {
      map_mark.label.content = options.name;
    }
    if (options.longitude) {
      map_mark.longitude = options.longitude;
    }
    if (options.latitude) {
      map_mark.latitude = options.latitude;
    }
    this.setData({longitude:map_mark.longitude, latitude:map_mark.latitude})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    let mapCtx = wx.createMapContext('myMap')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({markers:[map_mark]})
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