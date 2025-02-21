// pages/index/region.ts

import config from '../../services/config'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    locationMsg:'未定位',
    reovinces : [],//省份
    selectedReovince: null,
    citys:[], //城市
    selectedCity:null,
    districts:[],//区域
  },
  getLocation() {
    let app = getApp()
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        // globalData.longitude = res.longitude
        // globalData.latitude = res.latitude
        // globalData.speed = res.speed
        // globalData.accuracy = res.accuracy
        app.globalData;
        wx.setStorage({key : 'location', data:res})
      },
      fail:function(res) {
        let locationMsg = res.errMsg == 'getLocation:fail auth deny' ? '未授权定位' : res.errMsg
        that.setData({locationMsg:locationMsg})
      }
     })
  },
  /**
   * 省份选择.
   * @param e 事件参数
   */
  chooseReovinceRegion(e:any) {
    let reovinceId = e.target.dataset.reovinceId;
    let selectedReovince = null, row = null;
    //选择性加载数据.
    for(let i = 0; this.data.reovinces.length; i++) {
      row = this.data.reovinces[i]
      if (row['id'] == reovinceId) {
        selectedReovince = row;
        break;
      }
    }
    this.setData({selectedReovince:selectedReovince, selectedCity: null})
    this.requestRegion({reovinceId:reovinceId})
  },
  /**
   * 城市事件.
   * @param e 事件参数
   */
  chooseCityRegion(e:any) {
    let cityId = e.target.dataset.cityId
    let selectedCity = null, row = null;
    let app = getApp();
    for(let i = 0; this.data.citys.length; i++) {
      row = this.data.citys[i]
      if (row['id'] == cityId) {
        selectedCity = row;
        if (i == 0) {
          app.setData({regionId:row['id']})
          app.setData({city:row['name']})
          wx.navigateBack({delta: 1});
          this.closeRefreshPage();
          return;
        }
        break;
      }
    }
    this.setData({selectedCity:selectedCity})
    this.requestRegion({cityId:cityId})
  },
  /**
   * 区域选择.
   * @param e 区域参数
   */
  chooseAreaRegion(e:any) {
    let districtId = e.target.dataset.districtId;
    let row = null;
    let app = getApp();
    //判断选择满足条件.
    for(let i = 0; this.data.districts.length; i++) {
      row = this.data.districts[i];
      if (row['id'] == districtId) {
        app.setData({regionId:row['id']})
        app.setData({city:row['name']})
        break;
      }
    }
    wx.navigateBack({delta: 1});
    this.closeRefreshPage();
  },
  requestRegion(param: any) {
    param.parentId = param.parentId ? param.parentId : param.reovinceId;
    param.parentId = param.parentId ? param.parentId : param.cityId;
    wx.request({
      url: config.domain +  '/stock/region/list', // 替换为你的接口地址
      data:param,
      success: (res: any) => {
        if (param.reovinceId) {
          res.data.unshift(this.data.selectedReovince)
          this.setData({citys: res.data})
        } else if (param.cityId) {
          res.data.unshift(this.data.selectedCity)
          this.setData({districts: res.data})
        }
      },
      fail: (err) => {
        // 请求失败也隐藏加载提示
        wx.showToast({title:err.errMsg, icon:'none'})
      }
    });
  },
  /**
   * 根据经纬度转换所在城市.
   * @param longitude 经度
   * @param latitude 纬度
   */
  getCityInfo(longitude: any, latitude: any) {
    const key = 'YOUR_AMAP_API_KEY'; // 替换为你的高德地图API Key
    const url = 'https://restapi.amap.com/v3/geocode/regeo?output=json&location=${longitude},${latitude}&key=${key}';
    url.replace('${longitude}', longitude);
    url.replace('${latitude}', latitude);
    url.replace('${key}', key);
    wx.request({
      url: url,
      success(res: any) {
        if (res.data.status === '1') {
          const city = res.data.regeocode.addressComponent.city;
          console.log('当前城市:', city);
          // 这里可以将城市信息用于后续逻辑
        } else {
          console.error('逆地理编码失败', res.data.info);
        }
      },
      fail(err) {
        console.error('请求失败', err);
      }
    });
  },
  closeRefreshPage() {
    const pages = getCurrentPages();
    for (let i =0; i < pages.length; i++) {
      if (pages[i]['route'] == "pages/index/index") {
        pages[i].refresh();
        break;
      }
    }
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
    let app = getApp()
    wx.showLoading({ title: '加载中...' }); // 显示加载提示
    wx.request({
      url: config.domain +  '/stock/region/list', // 替换为你的接口地址
      data: {
        regionId:app.globalData.regionId
      },
      success: (res: any) => {
        wx.hideLoading(); // 隐藏加载提示
        let data = res.data
        if (data && data.length > 0) {
          this.setData({reovinces: data})
        } else {
          
        }
      },
      fail: (err) => {
        wx.hideLoading(); // 请求失败也隐藏加载提示
        console.error('数据加载失败:', err);
      }
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