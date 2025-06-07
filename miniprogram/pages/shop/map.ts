// pages/shop/map.ts

let map_mark =  {id: 2, latitude: 22.2655998353, longitude: 113.322520, width:'50rpx',height:'50rpx',
    label: {
    content: 'label 文本',
    fontSize: 14,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 5,
    bgColor: '#fff',
    padding: 5
  }
};

let start_mark = {
  id: 1, latitude: 22.2655998353, longitude: 113.322520, iconPath: '/images/location.png', width:'70rpx',height:'70rpx',
  callout: {content: '起点', color: '#36bb36', fontSize: 14,borderWidth: 2, borderRadius: 10,borderColor: '#000000',bgColor: '#fff', 
  padding: 0, display: 'ALWAYS', textAlign: 'center'},
  label: {
    content: '',
    fontSize: 14,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 5,
    bgColor: '#fff',
    padding: 5
  }
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userLatitude: 0 as number,
    userLongitude: 0 as number,
    latitude: 23.096994,
    longitude: 113.324520,
    markers: [{id:1,latitude: 22.2655998353, longitude: 113.322520, width:'100rpx',height:'100rpx'}],
    customCalloutMarkerIds: [],
    polylines: [] as any,
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
    //global applicatoiin hook.
    let app = getApp();
    if (app.globalData.longitude && app.globalData.latitude) {
      let polyline = [{
        points: [
          {longitude: app.globalData.longitude, latitude: app.globalData.latitude},
          {longitude: map_mark.longitude, latitude:map_mark.latitude}
        ],
        color: '#58c16c', width: 6, borderColor: '#2f693c', borderWidth: 1
      }];
      this.setData({
        userLongitude: app.globalData.longitude,
        userLatitude: app.globalData.latitude,
        longitude:map_mark.longitude, latitude:map_mark.latitude, polylines: polyline
      })
    } else {
      this.setData({ userLongitude: 0, userLatitude: 0, longitude:map_mark.longitude, latitude:map_mark.latitude, polylines: [] })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    let mapCtx = wx.createMapContext('myMap');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (this.data.userLatitude > 0) {
      start_mark.longitude = this.data.userLongitude;
      start_mark.latitude = this.data.userLatitude;
      this.setData({markers:[start_mark, map_mark]})
    } else {
      this.setData({markers:[map_mark]})
    }
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