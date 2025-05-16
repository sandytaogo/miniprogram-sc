import { fetchCouponDetail } from '../../../services/coupon';

Page({
  data: {
    detail: null,
    storeInfoList: [],
    storeInfoStr: '',
    showStoreInfoList: false,
  },

  id: '',

  onLoad(query: any) {
    const id = query.id;
    this.id = id;
    this.getGoodsList(id);
  },

  getGoodsList(id: string) {
    fetchCouponDetail(id).then((data: any) => {
      this.setData({detail: data.detail});
    });
  },

  navGoodListHandle() {
    wx.navigateTo({
      url: `/pages/coupon/coupon-activity-goods/index?id=${this.id}`,
    });
  },
});
