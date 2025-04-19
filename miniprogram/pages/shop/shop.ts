// pages/shop/shop.ts

import config from '../../config/env'

let map_mark =  {id: 1, latitude: 22.2655998353, longitude: 113.322520, iconPath: '/images/location.png', width:'100rpx',height:'100rpx',
  // callout: {
  //   content: '文本内容',
  //   color: '#ff0000',
  //   fontSize: 14,
  //   borderWidth: 2,
  //   borderRadius: 10,
  //   borderColor: '#000000',
  //   bgColor: '#fff',
  //   padding: 5,
  //   display: 'ALWAYS',
  //   textAlign: 'center'
  // }
    label: {
    content: 'label 文本',
    fontSize: 14,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 5,
    bgColor: '#fff',
    padding: 5
  }
}

interface MapMarker {
  id: Number, 
  latitude: 22.2655998353, 
  longitude: 113.322520, 
  iconPath: '', 
  width:'100rpx',
  height:'100rpx'
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    shop: {id: '', name: '', img: '', prePrice: 0, lng: 113.54342, lat: 22.26666},
    gallery: [],
    attribute: [],
    issueList: [],
    comment: [{}],
    brand: {},
    nbLoading: "加载中...",
    specificationList: [],
    productList: [],
    relatedGoods: [],
    cartGoodsCount: 0,
    userHasCollect: 0,
    number: 1,
    markers: [{id:1,latitude: 22.2655998353, longitude: 113.322520, width:'100rpx',height:'100rpx'}],
    customCalloutMarkerIds: [],
    num: 1,
    checkedSpecText: '请选择规格数量',
    openAttr: false,
    noCollectImage: "/images/icon_collect.png",
    hasCollectImage: "/images/icon_collect_checked.png",
    collectBackImage: "/images/icon_collect.png"
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options:any) {
    this.setData({id: options.id, markers:[]})
   },
  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady() {
    wx.showLoading({ title: '加载中...' }); // 显示加载提示
    var app = getApp()
    wx.request({
      url: config.domain + '/stock/shop/detail', // 替换为你的接口地址
      data: {
        shopId:this.data.id,
        lng:app.globalData.longitude ? app.globalData.longitude : '', 
        lat:app.globalData.latitude ? app.globalData.latitude : ''
      },
      success: (res: any) => {
        wx.hideLoading(); // 隐藏加载提示
        let data = res.data;
        map_mark.longitude = data.lng;
        map_mark.latitude = data.lat;
        map_mark.label.content = data.name;
        this.setData({shop: res.data, gallery:data.imageList, issueList: res.data.issueList, markers:[map_mark]})
        // let mapCtx = wx.createMapContext('myMap')
      },
      fail: (err) => {
        wx.hideLoading(); // 请求失败也隐藏加载提示
        console.error('数据加载失败:', err);
      }
    });
    this.setData({nbLoading:''})
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow() {

  },
  labeltap:function(e:any) {
    console.log('labeltap' + e)
  },
  markertap:function(e:any) {
    console.log('markertap' + e)
  },
  switchAttrPop:function(e:any) {
    console.log('switchAttrPop' + e);
  },
  openDetailMap:function(e:any) {
    wx.navigateTo({url:'map?latitude='+this.data.shop.lat+'&longitude='+this.data.shop.lng+'&name='+this.data.shop.name+''})
  },
  /**
   * 添加预约订单.
   * @param event
   */
  addToPreOrder:function(event:any) {
    let orderData = {... this.data.shop, storeId: this.data.shop.id, 
      storeName: this.data.shop.name, title: this.data.shop.name,
      primaryImage:this.data.shop.img, quantity:1, price: this.data.shop.prePrice
    };
    wx.setStorageSync('shop.goodsRequestList', JSON.stringify([orderData]));
    wx.navigateTo({url: '/pages/order/order-confirm/orderConfirm?type=shop'});
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