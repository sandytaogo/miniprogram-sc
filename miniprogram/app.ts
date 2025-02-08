// app.ts
App<IAppOption>({
  globalData: {
    userInfo: undefined,
    city:'珠海市',
    regionId:440400
   },

   setData(param) {
    if (param.regionId) {
      this.globalData.regionId = param.regionId
    }
    if (param.city) {
      this.globalData.city = param.city
    }
   },

  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    let globalData = this.globalData;
    //获取本地缓存地理位置信息.
    wx.getStorage({key : 'location', success: function(res) {
      if (res.data) {
        globalData.longitude = res.data.longitude
        globalData.latitude = res.data.latitude
        globalData.speed = res.data.speed
        globalData.accuracy = res.data.accuracy
      }
    }})

    wx.getLocation({
      type: 'wgs84',
      success (res) {
        globalData.longitude = res.longitude
        globalData.latitude = res.latitude
        globalData.speed = res.speed
        globalData.accuracy = res.accuracy
        wx.setStorage({key : 'location', data:res})
      },
      fail:function(res) {
        console.error(res)
      }
     })
    // 登录
    wx.login({
      success: res => {
        console.log('login:' + res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  }
})