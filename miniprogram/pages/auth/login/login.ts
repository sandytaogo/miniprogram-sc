// pages/auth/login/login.ts
const defaultAvatarUrl = '/images/default_avatar.png'
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
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    });
    console.log('关闭页面')
      // 登录
    wx.login({
      success: res => {
        console.log('login:' + res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    setTimeout(function() {
      // 返回上一页面
      wx.navigateBack({delta: 1})
    }, 1000)
  },
  onInputChange(e: any) {
    const nickName = e.detail.value
    const { avatarUrl } = this.data.userInfo
    this.setData({"userInfo.nickName": nickName, hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl})
  },
  getUserProfile() {
    const app = getApp()
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        app.setData({'userInfo' : res.userInfo })
        this.setData({userInfo: res.userInfo, hasUserInfo: true})
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