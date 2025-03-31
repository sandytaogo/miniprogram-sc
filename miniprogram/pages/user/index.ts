import env from '../../config/env'
import service from '../../services/service'

const menuData = [
  [
    {title: '收货地址',tit: '',url: '',type: 'address'},
    {title: '优惠券',tit: '',url: '',type: 'coupon'},
    {title: '积分', tit: '',url: '', type: 'point'},
  ],
  [
    {title: '帮助中心',tit: '',url: '',type: 'help-center'},
    {title: '客服热线',tit: '',url: '',type: 'service', icon: 'service'},
  ],
  [
    {title: '退出登录',tit: '',url: '',type: 'logout'},
  ],
];

const orderTagInfos = [
  {title: '待付款',iconName: 'wallet',orderNum: 0,tabType: 5,status: 1},
  {title: '待发货',iconName: 'deliver',orderNum: 0,tabType: 10,status: 1},
  {title: '待收货',iconName: 'package',orderNum: 0,tabType: 40,status: 1},
  {title: '待评价', iconName: 'comment',orderNum: 0,tabType: 60,status: 1},
  {title: '退款/售后',iconName: 'exchang',orderNum: 0,tabType: 0,status: 1},
];

Page({
  data: {
    showMakePhone: false,
    userInfo: {
      avatarUrl: '',
      nickName: '未登录',
      phoneNumber: '',
    },
    menuData,
    orderTagInfos,
    customerServiceInfo: {},
    currAuthStep: 1,
    showKefu: true,
    versionNo: '',
  },

  onLoad() {
    this.getVersionInfo();
  },
  /**
   * 每次进入页面就绪状态开始执行初始化.
   */
  onReady() {

  },
  onShow() {
  //  this.getTabBar().init();
    //this.init();
    const app = getApp();
    if (app.globalData.userInfo) {
      this.setData({userInfo:app.globalData.userInfo, currAuthStep:2});
    }
    service.request({
      url: env.domain + '/user/uc/counter',
      header: {'X-Requested-With': 'XMLHttpRequest'},
      method: 'GET',
      authCheck: false,
      success: (res: any) => {
        let data = res.data;
        let menuData = this.data.menuData;
        let orderTagInfos = this.data.orderTagInfos;
        if (data.code == 200) {
          //更新用户订单信息.
          orderTagInfos[0].orderNum = data.data.unpay;
          orderTagInfos[1].orderNum = data.data.unshipment;
          orderTagInfos[2].orderNum = data.data.unconfirm;
          orderTagInfos[3].orderNum = data.data.exchange;
          orderTagInfos[4].orderNum = data.data.comment;
          //用户地址优惠券等信息.
          menuData[0][0]['tit'] = data.data.address ? data.data.address : '';
          menuData[0][1]['tit'] = data.data.coupon ? data.data.coupon : '';
        } else {
          menuData[0].forEach(item => {
            item['tit'] = '';
          });
          orderTagInfos.forEach(item => {
            item['orderNum'] = 0;
          });
        }
        this.setData({menuData: menuData, orderTagInfos: orderTagInfos});
      }, 
      fail : (err: any)  => {
      }
    });
  },
  onPullDownRefresh() {
    this.init();
  },

  init() {
    this.fetUseriInfoHandle();
  },

  fetUseriInfoHandle() {
        this.setData({currAuthStep: 2});
        wx.stopPullDownRefresh();
  },

  onClickCell(currentTarget:any) {
    const { type } = currentTarget.target.dataset;
    switch (type) {
      case 'address': {
        wx.navigateTo({ url: '/pages/user/address/list/index' });
        break;
      }
      case 'service': {
        this.openMakePhone();
        break;
      }
      case 'coupon': {
        wx.navigateTo({ url: '/pages/coupon/coupon' });
        break;
      }
      case 'point': {
        wx.showToast({icon:'none', title: '您暂时没有积分'});
        break;
      }
      case 'help-center': {
        this.setData({ showMakePhone: true });
        break;
      }
      case 'logout' : { this.logout(); break;}
      default: {
        break;
      }
    }
  },

  jumpNav(e:any) {
    const status = e.detail.tabType;
    if (status === 0) {
      wx.navigateTo({ url: '/pages/order/after-service-list/index' });
    } else {
      wx.navigateTo({ url: `/pages/order/order-list/index?status=${status}` });
    }
  },

  jumpAllOrder() {
    wx.navigateTo({ url: '/pages/order/order-list/index' });
  },

  openMakePhone() {
    this.setData({ showMakePhone: true });
  },

  closeMakePhone() {
    this.setData({ showMakePhone: false });
  },

  call() {
    wx.makePhoneCall({phoneNumber: '15012412522'});
  },

  gotoUserEditPage() {
    const { currAuthStep } = this.data;
    if (currAuthStep === 2) {
      wx.navigateTo({ url: '/pages/user/person-info/index' });
    } else if (currAuthStep === 1) {
      wx.navigateTo({ url: '/pages/auth/login/login' });
    } else {
      this.fetUseriInfoHandle();
    }
  },
  /**
   * 获取版本信息.
   */
  getVersionInfo() {
    const versionInfo = wx.getAccountInfoSync();
    const { version, envVersion = __wxConfig } = versionInfo.miniProgram;
    this.setData({versionNo: envVersion === 'release' ? version : envVersion});
  },
  /**
   * 退出账号.
   */
  logout() {
    if (this.data.currAuthStep == 1) {
      return;
    }
    wx.showLoading({title: '请稍后...'})
    service.request({
      url: env.domain + "/user/u/logout",
      method:'POST',
      authChech: false,
      success : (res:any) => {
        wx.hideLoading();
        let data = res.data;
        if (data.code == 200) {
          env.setUserInfo(null);
          let app = getApp();
          app.setData({userInfo: null});
          this.setData({currAuthStep: 1,userInfo: {avatarUrl: '',nickName: '未登录',phoneNumber: '',}});
        }
      },
      fail: (err:any) => {
        wx.hideLoading();
      }
    });
  }
});
