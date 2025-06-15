/**
 * 程序主页.
 * @author sandy.
 * @since 1.0.0 2024-12-12 12:12:12
 */
import env from '../../config/env'
import {getRect} from '../../utils/util'
var app = getApp();
Page({
  data: {
    intervalHomeId: 0,
    searchPlaceholder:'',
    swiperUrls: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 15000,
    duration: 500,
    noMoreText:'已经到底啦',
    listLoading: 0,
    page:1,
    channels: [],
    floorGoods: [
      {id:"1", name:"推荐服务", goodsList: []}
    ],
    city: app.globalData.city,
    currentTabIndex:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    /**
     * 初始化事件.
     */
    this.initEvent({});
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
   * 初始化事件.
   * @param event 
   */
  initEvent: function(event: any) {
    // const query = this.createSelectorQuery()
    // query.select('.load-more').boundingClientRect(function(res: any) {
    //   res.top // #the-id 节点的上边界坐标（相对于显示区域）
    // });
    // query.exec();
    this.fetchHomeData();
    this.data.intervalHomeId = setInterval (() => {
      this.fetchHomeData();
    }, 5000);
  },
  /**
   * 获取首页数据.
   */
  fetchHomeData: function() {
    wx.request({
      url: env.domain + '/stock/shop/home', // 替换为你的接口地址
      data: {},
      success: (res: any) => {
        this.setData({swiperUrls:res.data.swiperUrls, channels:res.data.channels, searchPlaceholder:res.data.searchPlaceholder})
        app.setData({other:{searchPlaceholder:res.data.searchPlaceholder}});
       clearInterval(this.data.intervalHomeId);
      },
      fail: (err) => {
        wx.hideLoading(); // 请求失败也隐藏加载提示
      }
    });
  },
  navToSearchPage:function(event:any) {
    event.detail;
    // TO DO method.
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
    //wx.showLoading({ title: '加载中...' }); // 显示加载提示
    this.setData({ listLoading : 1});
    const page = this.data.page;
    let floorGoods = this.data.floorGoods;
    wx.request({
      url: env.domain + '/stock/shop/list', // 替换为你的接口地址
      timeout: 15000,
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
          this.setData({floorGoods: floorGoods, page: page + 1, listLoading : 0}); // 没有数据则认为没有更多数据了
        } else {
          this.setData({listLoading : 2, noMoreText: floorGoods[0].goodsList.length ? '已经到底啦' : '无服务敬请期待'}); // 没有数据则认为没有更多数据了
        }
      },
      fail: (err) => {
        wx.hideLoading(); // 请求失败也隐藏加载提示
        console.error('数据加载失败:', err);
        this.setData({ listLoading : 3});
      }
    });
  },
  loadMoreData: function() {
    if ( this.data.listLoading == 0 ) {
      this.loadData(); // 调用加载数据的函数
    }
  },

  onPageScroll(event: any) {
     if (this.data.listLoading === 0) {
      this.loadMoreData();
     }
   },

  onRefresh:function(params:any) {
    this.fetchHomeData();
    params = params ? params : {};
    this.setData({page:1, listLoading: 0, city: app.globalData.city, floorGoods: [{id:"1", name:"推荐服务", goodsList: []}]});
    this.loadMoreData();
  },
  /**
   * 重试事件.
   * @param event.
   */
  onRetry:function(event: any) {
    this.loadData();
  },
  /**
   *  通道服务事件.
   */
  onChannelsEvent:function(event: any) {
    let { id } = event.currentTarget.dataset;
    switch(id) {
      case 1:  break;
      default:
        wx.showToast({icon:'none', title:'暂未开放请联系管理员'});
    };
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
    this.setData({page:1, listLoading: 0, city: app.globalData.city, floorGoods: [{id:"1", name:"推荐服务", goodsList: []}]});
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