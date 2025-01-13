// pages/cart/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartGoods: [
      {id:"1", checked:true, goods_name:"家电", number:2, 
        list_pic_url:"https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner5.png",retail_price:23.23
      },
      {id:"2", checked:true, goods_name:"家电", number:2, 
        list_pic_url:"https://cdn-we-retail.ym.tencent.com/tsr/home/v2/banner5.png",retail_price:23.23
      }
    ],
    cartTotal: {
      "goodsCount": 0,
      "goodsAmount": 0.00,
      "checkedGoodsCount": 0,
      "checkedGoodsAmount": 0.00
    },
    isEditCart: true,
    checkedAllStatus: true,
    editCartList: []
  },

  cutNumber : function(event) {
    let itemIndex = event.target.dataset.itemIndex
    let cartItem = this.data.cartGoods[itemIndex]
    let number = (cartItem.number - 1 > 1) ? cartItem.number - 1 : 1
    cartItem.number = number
    this.setData({
      cartGoods: this.data.cartGoods
    })
  },
  addNumber : function(event) {
    let itemIndex = event.target.dataset.itemIndex
    let cartItem = this.data.cartGoods[itemIndex]
    let number = cartItem.number + 1
    cartItem.number = number
    this.setData({
      cartGoods: this.data.cartGoods
    })
    this.updateCart(cartItem.product_id, cartItem.goods_id, number, cartItem.id)
  },
  updateCart: function (productId, goodsId, number, id) {
    let that = this
    util.request(api.CartUpdate, {
      productId: productId,
      goodsId: goodsId,
      number: number,
      id: id
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        console.log(res.data)
        that.setData({
          //cartGoods: res.data.cartList,
          //cartTotal: res.data.cartTotal
        })
      }

      that.setData({
        checkedAllStatus: that.isCheckedAll()
      })
    })

  },

  isCheckedAll: function () {
    //判断购物车商品已全选
    return this.data.cartGoods.every(function (element, index, array) {
      if (element.checked == true) {
        return true
      } else {
        return false
      }
    })
  },
  checkedAll: function () {
    let that = this
    if (!this.data.isEditCart) {
      var productIds = this.data.cartGoods.map(function (v) {
        return v.product_id
      })
      util.request(api.CartChecked, { productIds: productIds.join(','), isChecked: that.isCheckedAll() ? 0 : 1 }, 'POST').then(function (res) {
        if (res.errno === 0) {
          console.log(res.data)
          that.setData({
            cartGoods: res.data.cartList,
            cartTotal: res.data.cartTotal
          })
        }

        that.setData({
          checkedAllStatus: that.isCheckedAll()
        })
      })
    } else {
      //编辑状态
      let checkedAllStatus = that.isCheckedAll()
      let tmpCartData = this.data.cartGoods.map(function (v) {
        v.checked = !checkedAllStatus
        return v
      })

      that.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      })
    }

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