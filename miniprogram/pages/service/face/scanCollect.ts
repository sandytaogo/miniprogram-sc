// pages/service/face/scanCollect.ts
import env from '../../../config/env';
import service from '../../../services/service';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataDict:[],
    total:0
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
    service.request({
      url: env.domain + '/stock/property/list',
      method: 'get',
      success:(res: any) => {
        this.setData({dataDict: res.data, total: res.data.length});
      }, 
      fail: (err: any) => {
        wx.hideLoading(); // 请求失败也隐藏加载提示
        console.error('数据加载失败:', err);
      }
    });
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

    wx.stopPullDownRefresh();
  
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