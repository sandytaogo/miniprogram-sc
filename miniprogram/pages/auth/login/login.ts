// pages/auth/login/login.ts
import env from '../../../config/env'
const defaultAvatarUrl = env.domain + '/images/minlogo.png'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
  },
    // 事件处理函数
    bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs',
    })
  },
  chooseAvatar(e:any) {
    console.log(e);
  },
  onChooseAvatar(e: any) {
    const { avatarUrl } = e.detail
    const { nickName } = this.data.userInfo
    // this.setData({
    //   "userInfo.avatarUrl": avatarUrl,
    //   hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    // });
      // 登录
    wx.login({
      success: res => {
        this.doWeChatAuthorization({jscode:res.code})
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  onInputChange(e: any) {
    const nickName = e.detail.value
    const { avatarUrl } = this.data.userInfo
    this.setData({"userInfo.nickName": nickName, hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl})
  },
  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '微信授权登录', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        // 登录
        wx.login({
          success: res => {
            this.doWeChatAuthorization({jscode:res.code})
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
          }
        })
      }
    })
  },
  onGetuserinfo(e:any) {
    wx.showLoading({ title: '授权中...' });
    let data = e.detail;
    // 登录
    wx.login({
      success: res => {
        this.doWeChatAuthorization({jscode:res.code, encryptedData: data.encryptedData, iv:data.iv, rawData:data.rawData, signature:data.signature})
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  doWeChatAuthorization(params:any) {
    const app = getApp()
    //发起网络请求
    wx.request({
      url: env.domain + '/user/mini/sns/jscode2session',
      data: {'jscode': params.jscode, encryptedData: params.encryptedData, iv:params.iv, rawData:params.rawData, signature:params.signature},
      method:'POST',
      header: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      timeout:15000,
      success : (res:any) => {
        wx.hideLoading();
        let data = res.data;
        if (data.code == 200) {
          app.setData({'userInfo' : JSON.parse(params.rawData)})
          this.setData({userInfo: params.rawData, hasUserInfo: true})
          // 返回上一页面
          wx.navigateBack({delta: 1}) 
        } else {
          wx.showToast({icon:'none', title:res.data.msg});
        }
      },
      fail: (err) => {
        wx.hideLoading();
        if (err.errMsg == 'request:fail timeout') {
          wx.showToast({icon:'none', title:'授权超时'});
        } else {
          wx.showToast({icon:'none', title:err.errMsg});
        }
      }
    })
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