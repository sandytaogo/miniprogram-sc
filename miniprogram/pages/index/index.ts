// index.ts
// 获取应用实例
import env from '../../config/env'

import {getRect} from '../../utils/util'

var app = getApp();

Page({
  data: {
    goodsListLoadStatus: 0,
    searchPlaceholder:'',
    swiperUrls: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 15000,
    duration: 500,
    loadingText:'更多',
    hasMore:true,
    page:1,
    channels: [],
    floorGoods: [
      {id:"1", name:"推荐服务", goodsList: []}
    ],
    city: app.globalData.city,
    currentTabIndex:0,
  },
  onReTry:function() {
    console.log('onReTry')
  },
  navToSearchPage:function(e:any) {
    console.log(e)
  },
  onTabsClick:function(e:any) {
    if (e.target.dataset.index == this.data.currentTabIndex) {
      return;
    }
    const { index } = e.currentTarget.dataset;
    getRect(this, '.header-item', true).then((res:any) => {
      let distance = 0;
      for (let rect in res) {
        var tab = res[rect];
        if (tab.dataset.index == e.target.dataset.index) {
          distance += tab.width / 2;
          distance = tab.left + (tab.width / 2) - 10;
          break;
        } else {
          distance += tab.width;
        }
      }
      this.setData({currentTabIndex:tab.dataset.index, trackStyle: `-webkit-transform: translateX(${distance}px);transform: translateX(${distance}px`});
    });
  },
  loadData: function() {
    if (!this.data.hasMore) return; // 如果没有更多数据，则不进行加载
    //wx.showLoading({ title: '加载中...' }); // 显示加载提示
    this.setData({loadingText:'加载中...'})
    const page = this.data.page;
    let floorGoods = this.data.floorGoods;
    wx.request({
      url: env.domain + '/stock/shop/list', // 替换为你的接口地址
      data: {
        regionId:app.globalData.regionId, 
        lng:app.globalData.longitude ? app.globalData.longitude : '', 
        lat:app.globalData.latitude ? app.globalData.latitude : '', 
        page: page
      },
      success: (res: any) => {
        wx.hideLoading(); // 隐藏加载提示
        let data = res.data
        if (data && data.length > 0) {
          floorGoods[0].goodsList = floorGoods[0].goodsList.concat(data);
          this.setData({floorGoods: floorGoods, page: page + 1}); // 没有数据则认为没有更多数据了
        } else {
          this.setData({ hasMore:false, loadingText: floorGoods[0].goodsList.length ? '已经到底啦' : '无服务敬请期待'}); // 没有数据则认为没有更多数据了
        }
      },
      fail: (err) => {
        wx.hideLoading(); // 请求失败也隐藏加载提示
        console.error('数据加载失败:', err);
      }
    });
  },
  loadMoreData: function() {
    if (this.data.hasMore) { // 只有当还有更多数据时才加载更多数据
      this.loadData(); // 调用加载数据的函数
    }
  },
  refresh:function(params:any) {
    params = params ? params : {};
    this.setData({hasMore:true, page:1, city: app.globalData.city, floorGoods: [{id:"1", name:"推荐服务", goodsList: []}]});
    this.loadMoreData();
  },
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    wx.request({
      url: env.domain + '/stock/shop/home', // 替换为你的接口地址
      data: {},
      success: (res: any) => {
        this.setData({swiperUrls:res.data.swiperUrls, channels:res.data.channels, searchPlaceholder:res.data.searchPlaceholder})
        app.setData({other:{searchPlaceholder:res.data.searchPlaceholder}})
      },
      fail: (err) => {
        wx.hideLoading(); // 请求失败也隐藏加载提示
        console.error('数据加载失败:', err);
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.loadData()
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
    this.setData({hasMore:true, page:1, city: app.globalData.city, floorGoods: [{id:"1", name:"推荐服务", goodsList: []}]});
    this.loadMoreData();
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