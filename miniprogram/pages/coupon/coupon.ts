import { fetchCouponList } from '../../services/coupon';

Page({
  data: {
    status: 0,
    list: [
      {text: '可使用', key: 0,},
      {text: '已使用',key: 1,},
      { text: '已失效',key: 2,},
    ],
    pullDownRefreshEnable:false,
    couponList: [],
  },

  onLoad() {
    this.init();
  },

  init() {
    this.fetchList();
  },

  fetchList(status = this.data.status) {
    let statusInFetch = '';
    switch (Number(status)) {
      case 0: {
        statusInFetch = 'default';
        break;
      }
      case 1: {
        statusInFetch = 'useless';
        break;
      }
      case 2: {
        statusInFetch = 'disabled';
        break;
      }
      default: {
        throw new Error(`unknown fetchStatus: ${statusInFetch}`);
      }
    }
    fetchCouponList(statusInFetch).then((couponList:any) => {
      this.setData({ couponList });
    });
  },

  tabChange(e:any) {
    const { value } = e.detail;
    this.setData({ status: value });
    this.fetchList(value);
  },

  goCouponCenterHandle() {
    wx.showToast({ title: '去领券中心', icon: 'none' });
  },

  onPullDownRefreshDesign() {
    this.setData({couponList: [], pullDownRefreshEnable:true,},
      () => {
        this.fetchList();
      },
    );
    setTimeout(() => {
      this.setData({ pullDownRefreshEnable: false });
    }, 1000);
  },
});
