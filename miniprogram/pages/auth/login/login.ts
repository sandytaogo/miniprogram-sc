// pages/auth/login/login.ts
import env from '../../../config/env'
import { sm2 } from 'sm-crypto';
import { delay } from '../../../services/_utils/delay';
const defaultAvatarUrl = env.domain + '/images/minlogo.png'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    uid:'',
    hasUserInfo: false,
    account:'',
    password:'',
    isLoginBtndisabled: false,
    isWechatAuthDisabled: false,
    userInfo: {avatarUrl: defaultAvatarUrl, nickName: ''},
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    userSafeInfo:{privateKey:'', publicKey:'', cookie: '', refreshToken: '', accessToken : '', userInfo: undefined, server: {publickey:''}
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const deviceInfo = wx.getDeviceInfo();
    this.setData({uid: deviceInfo.platform + '-' + deviceInfo.system + '-' + deviceInfo.model});
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    let userSafeInfoCache = env.getUserInfo();
    if (userSafeInfoCache == "" || userSafeInfoCache == undefined || userSafeInfoCache.publicKey == undefined) {
      let keypair = sm2.generateKeyPairHex();
      this.data.userSafeInfo.publicKey = keypair.publicKey;
      this.data.userSafeInfo.privateKey = keypair.privateKey;
    } else {
      this.setData({userSafeInfo: userSafeInfoCache});
    }
    this.loadSafePublicKey();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    
  },
  /**
   * 加载服务器信息安全加密public key.
   */
  loadSafePublicKey() {
    let info = env.getUserInfo();
    wx.request({
      url: env.domain + '/user/publickey', // 替换为你的接口地址
      header: {Cookie: info ? info.cookie : ''},
      data: {publickey : this.data.userSafeInfo.publicKey},
      success: (res: any) => {
        if (res.data.publickey) {
          let userSafeInfo = this.data.userSafeInfo;
          if (res.data.sm4.substring(0, 2) == "04") {
            res.data.sm4 = res.data.sm4.substring(2, res.data.sm4.length);
          }
          res.data.sm4 = sm2.doDecrypt(res.data.sm4, this.data.userSafeInfo.privateKey, 0);
          userSafeInfo.server = res.data;
          if (res.header['Set-Cookie']) {
            userSafeInfo.cookie = res.header['Set-Cookie'];
          }
          this.setData({userSafeInfo : userSafeInfo});
          env.setUserInfo(userSafeInfo);
        }
      },
      fail: (err) => {
        wx.hideLoading(); // 请求失败也隐藏加载提示
        console.error('数据加载失败:', err);
      }
    });
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({url: '../logs/logs'})
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
        this.doWeChatAuthorization({jscode:res.code});
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  onInputAccountChange(e: any) {
    const account = e.detail.value;
    const { avatarUrl } = this.data.userInfo
    this.setData({account : account});
    //this.setData({"userInfo.nickName": nickName, hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl})
  },
  onInputPasswordChange(e: any) {
    const password = e.detail.value;
    const { avatarUrl } = this.data.userInfo
    this.setData({password : password});
    //this.setData({"userInfo.nickName": nickName, hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl})
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

  /**
   * 获取微信用户信息.
   * @param event
   */
  onGetuserinfo(event:any) {
    this.setData({isWechatAuthDisabled: true});
    wx.showLoading({title: '授权中...' });
    let data = event.detail;
    // 登录
    wx.login({
      success: res => {
        delay(500).then(() =>
          this.doWeChatAuthorization({jscode:res.code, encryptedData: data.encryptedData, iv:data.iv, rawData:data.rawData, signature:data.signature})
        );
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
      header: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Cookie' : this.data.userSafeInfo.cookie},
      timeout:15000,
      success : (res:any) => {
        wx.hideLoading();
        let data = res.data;
        if (data.code == 200) {
          let userInfoObj = JSON.parse(params.rawData);
          this.data.userSafeInfo['accessToken'] = data.data.accessToken;
          this.data.userSafeInfo['refreshToken'] = data.data.refreshToken;
          this.data.userSafeInfo.userInfo = userInfoObj;
          env.setUserInfo(this.data.userSafeInfo);
          this.setData({userInfo: userInfoObj, hasUserInfo: true, isWechatAuthDisabled: false});
          app.setData({'userInfo' : userInfoObj});
          // 返回上一页面
          this.onLoginCallback();
          wx.navigateBack({delta: 1});
        } else {
          this.setData({isWechatAuthDisabled: false});
          wx.showToast({icon:'none', title:res.data.msg});
        }
      },
      fail: (err) => {
        wx.hideLoading();
        this.setData({isWechatAuthDisabled: false});
        if (err.errMsg == 'request:fail timeout') {
          wx.showToast({icon:'none', title:'授权超时'});
        } else {
          wx.showToast({icon:'none', title:err.errMsg});
        }
      }
    });
  },
  /**
   * 登录系统事件.
   * @param event 触发事件对象.
   */
  onLoginEvent(event:any) {
    if (this.data.account == '') {
      wx.showToast({icon:'none', title:'账号为空!'});
      return;
    }
    if (this.data.password == '') {
      wx.showToast({icon:'none', title:'密码为空!'});
      return;
    }
    //开始认证账号信息.
    wx.showLoading({title: '登录中...' });
    this.setData({isLoginBtndisabled: true});
    delay(500).then(() => {
      wx.request({
        url: env.domain + '/user/u/login',
        data: {
          account: sm2.doEncrypt(this.data.account, this.data.userSafeInfo.server.publickey, 0),
          password: sm2.doEncrypt(this.data.password, this.data.userSafeInfo.server.publickey, 0),
          publickey: this.data.userSafeInfo.publicKey,
          t: Date.now(),
          uid: this.data.uid,
          token: ''
        },
        method:'POST',
        header: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Cookie' : this.data.userSafeInfo.cookie},
        timeout:15000,
        success : (res:any) => {
          wx.hideLoading();
          let data = res.data;
          if (data.code == 200) {
            wx.showToast({icon:'success', title: data.msg});
            this.data.hasUserInfo = true;
            // 返回上一页面
            this.onLoginCallback();
            wx.navigateBack({delta: 1});
          } else {
            wx.showToast({icon:'none', title:res.data.msg});
            this.setData({isLoginBtndisabled: false});
          }
        },
        fail: (err) => {
          wx.hideLoading();
          this.setData({isLoginBtndisabled: false});
          if (err.errMsg == 'request:fail timeout') {
            wx.showToast({icon:'none', title:'登录超时'});
          } else {
            wx.showToast({icon:'none', title:err.errMsg});
          }
        }
      })
    });
  },

  /**
   * 登录成功后回调上层页面.
   */
  onLoginCallback() {
    let currentPages = getCurrentPages();
    if (1 < currentPages.length) {
      let currentPage = currentPages[currentPages.length - 2];
      if (currentPage.onRefresh) {
        currentPage.onRefresh();
      }
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
    if (this.data.hasUserInfo == false) {
      let currentPages = getCurrentPages();
      if (1 < currentPages.length) {
        let currentPage = currentPages[currentPages.length - 2];
        if (currentPage.onBack) {
          currentPage.onBack();
        }
      }
    }
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