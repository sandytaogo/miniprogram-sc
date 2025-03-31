// app.ts
App<IAppOption>({
  globalData: {
    userInfo: undefined,
    city:'珠海市',
    regionId:440400,
    other:{}
   },

   setData(param) {
    if (param.other) {
      for (let key in param.other) {
        if (param.other.hasOwnProperty(key)) {
          this.globalData.other[key] = param.other[key];
        }
      }
    }
 
    if (param.regionId) {
      this.globalData.regionId = param.regionId
    }
    if (param.city) {
      this.globalData.city = param.city
    }
    if (param.hasOwnProperty('userInfo')) {
      this.globalData.userInfo = param.userInfo;
    }
   },

  onLaunch() {
    // 展示本地存储能力
    let userData = wx.getStorageSync('user_safe_info');
    if (userData) {
      this.globalData.userInfo = userData.userInfo;
    }
    
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    let globalData = this.globalData;
    //获取本地缓存地理位置信息.
    let location = wx.getStorageSync('location');
    if (location) {
      globalData.longitude = location.longitude
      globalData.latitude = location.latitude
      globalData.speed = location.speed
      globalData.accuracy = location.accuracy
    }

    if (location == null || location.date == null || (Date.now() - location.date) / 1000 > 14400) {
      wx.getLocation({
        // type: 'wgs84',、
        success (res) {
          globalData.longitude = res.longitude
          globalData.latitude = res.latitude
          globalData.speed = res.speed
          globalData.accuracy = res.accuracy
          wx.setStorage({key:'location', data:{date:Date.now(), longitude:res.longitude, latitude:res.latitude, speed:res.speed, accuracy:res.accuracy}})
        },
        fail:function(res) {
          console.error(res)
        }
       })
    }
  }
})