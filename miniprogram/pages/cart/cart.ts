// pages/cart/cart.ts

import config from '../../services/config'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    is_rander_finish:false,
    cartGoods: [{id:0,number:0,goods_id:0,checked:true}],
    editCartList: [{id:0,number:0,goods_id:0,checked:true}],
    isEditCart: false,
    cartTotal: {
      "goodsCount": 0,
      "goodsAmount": 0.00,
      "checkedGoodsCount": 0,
      "checkedGoodsAmount": 0.00
    },
    checkedAllStatus: true
  },

  cutNumber : function(event : any) {
    let itemIndex = event.target.dataset.itemIndex
    let cartItem = this.data.cartGoods[itemIndex]
    let number = (cartItem.number - 1 > 1) ? cartItem.number - 1 : 1
    cartItem.number = number
    this.setData({
      cartGoods: this.data.cartGoods
    })
  },
  addNumber : function(event : any) {
    let itemIndex = event.target.dataset.itemIndex
    let cartItem = this.data.cartGoods[itemIndex]
    let number = cartItem.number + 1
    cartItem.number = number
    this.setData({cartGoods: this.data.cartGoods})
    this.updateCart(cartItem.id, cartItem.goods_id, number, cartItem.id)
  },
  getCartList: function () {
    let that = this;
    that.data;
  },
  editCart: function () {
    var that = this;
    if (this.data.isEditCart) {
      this.getCartList();
      this.setData({
        isEditCart: !this.data.isEditCart
      });
    } else {
      //编辑状态
      let tmpCartList = this.data.cartGoods.map(function (v) {
        v.checked = false;
        return v;
      });
      this.setData({
        editCartList: this.data.cartGoods,
        cartGoods: tmpCartList,
        isEditCart: !this.data.isEditCart,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }
  },
  updateCart: function (productId:Number, goodsId:Number, number:Number, id:Number) {
    let that = this
    that.setData({checkedAllStatus: that.isCheckedAll()})

    console.log( productId + '' + goodsId+ number + id)
  },
  deleteCart:function name(params:any) {
    console.log(params)
  },
  isCheckedAll: function () {
    //判断购物车商品已全选
    return this.data.cartGoods.every(function (element, index, array) {
      array[index]
      if (element.checked == true) {
        return true
      } else {
        return false
      }
    })
  },
  checkedItem: function (event : any) {
    let itemIndex = event.target.dataset.itemIndex;
    let that = this;
    if (!this.data.isEditCart) {

    } else {
      //编辑状态
      let tmpCartData = this.data.cartGoods.map(function (element, index, array) {
        array[index]
        if (index == itemIndex){
          element.checked = !element.checked;
        }
        return element;
      });

      that.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }
  },
  checkedAll: function () {
    let that = this
    if (!this.data.isEditCart) {
      var products = this.data.cartGoods.map(function (v : any) {return v})
      that.setData({cartGoods: products, checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      })
    } else {
      //编辑状态
      let checkedAllStatus = that.isCheckedAll()
      let tmpCartData = this.data.cartGoods.map(function (v) {
        v.checked = !checkedAllStatus
        return v
      })
      that.setData({cartGoods: tmpCartData, checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      })
    }
  },
  getCheckedGoodsCount: function(){
    let checkedGoodsCount = 0;
    this.data.cartGoods.forEach(function (v) {
      if (v.checked === true) {
        checkedGoodsCount += v.number;
      }
    });
    console.log(checkedGoodsCount);
    return checkedGoodsCount;
  },
  confirmOrder: function () {
    //获取已选择的商品
    var checkedGoods = this.data.cartGoods.filter(function (element, index, array) {
      array[index]
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });
    if (checkedGoods.length <= 0) {
      wx.showToast({title: '没有任何商品！', icon: 'error', duration: 3000})
      return;
    }
    wx.navigateTo({
      url: '/pages/cart/confirmOrder'
    })
  },
  loadCartData : function(params:any) {
    wx.showLoading({title: '加载中...'}); // 显示加载提示
    wx.request({
      url: config.domain + '/stock/cart/list', // 替换为你的接口地址
      data: {page:params.page},
      success: (res: any) => {
        wx.hideLoading(); // 隐藏加载提示
        this.setData({cartGoods: res.data.rows})
      },
      fail: (err) => {
        wx.hideLoading(); // 请求失败也隐藏加载提示
        console.error('数据加载失败:', err);
      }
    });
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
    if (this.data.is_rander_finish == false) {
      this.loadCartData({})
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (this.data.is_rander_finish == true) {
      this.loadCartData({})
    }

    this.data.is_rander_finish == true
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