/*
 * @Author: sandy
 * @Date: 2025-03-14 21:18:07
 * @Description:
 */
Page({
  data: {
    totalPaid: 0,
    orderNo: '',
    groupId: '',
    groupon: null,
    spu: null,
    adUrl: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { totalPaid = 0, orderNo = '', groupId = '' } = options;
    this.setData({totalPaid,orderNo,groupId});
  },

  onTapReturn(e) {
    const target = e.currentTarget.dataset.type;
    const { orderNo } = this.data;
    if (target === 'home') {
      wx.switchTab({ url: '/pages/index/index' });
    } else if (target === 'orderList') {
      wx.navigateTo({url: `/pages/order/order-list/index?orderNo=${orderNo}`});
    } else if (target === 'order') {
      wx.navigateTo({url: `/pages/order/order-detail/index?orderNo=${orderNo}`});
    }
  },

  navBackHandle() {
    wx.navigateBack();
  },
});
