import env from './config/env';
import service from './services/service';

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

  timedTaskStart() {
    setInterval(() => {
      if (this.globalData.userInfo == null || this.globalData.userInfo == undefined) {
        return;
      }
      service.request({
        url: env.domain + '/stock/message/unreadCount',
        method:'GET',
        checkAuthgoto: false,
        header: {'X-Requested-With': 'XMLHttpRequest'},
        success: (res:any) => {
          wx.hideLoading();
          if (typeof res.data == 'number' && res.data > 0) {
            wx.setTabBarBadge({index: 2, text: `${res.data}`});
          } else {
            wx.removeTabBarBadge({index: 2 });
          }
        },
        fail:(err:any) => {
          wx.hideLoading();
        }
      });
    }, 45000);
  },

  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    let userData = wx.getStorageSync('sandy_sc_user_safe_info');
    if (userData) {
      this.globalData.userInfo = userData.userInfo;
    }    
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
    //启动定时任务.
    this.timedTaskStart();
  }
})