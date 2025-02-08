// index.ts
// 获取应用实例
var app = getApp();

Component({
  data: {
    goodsListLoadStatus: 0,
    background: [
      'https://xinxinji.cn/images/bmfw.jpeg','https://xinxinji.cn/images/zhsq.jpg','https://xinxinji.cn/images/rgzn.png',
      'https://xinxinji.cn/images/shopping.jpg','https://xinxinji.cn/images/zhfwz.jfif', 'https://xinxinji.cn/images/xqmj.jpg',
      'https://xinxinji.cn/images/cpsb.png'
    ],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    loadingText:'更多',
    hasMore:true,
    page:1,
    channel: [
      {id:"1", name:"测试", url:"", icon_url:"/images/icon_collect_checked.png"},
      {id:"2", name:"测试2", url:"", icon_url:"/images/icon_collect_checked.png"},
      {id:"3", name:"测试3", url:"", icon_url:"/images/icon_collect_checked.png"},
      {id:"4", name:"测试4", url:"", icon_url:"/images/icon_collect_checked.png"},
      {id:"5", name:"更多", url:"", icon_url:"/images/menu_sort_pressed.png"}
    ],
    floorGoods: [
      {id:"1", name:"商品", goodsList: []}
    ],
    city: app.globalData.city,
  },
  lifetimes: {
    ready: function() {
      // wx.onAfterPageUnload(function(res:any){
      //     console.log('onAfterPageUnload:' + res)
      // })
      this.loadData()
    },
    created: function() {
      console.log('组件被创建了');
    },
    attached: function() {
      console.log('组件已经挂载到页面上');
    },
    detached: function() {
      console.log('组件被销毁了');
    }
  },
  methods: {
    onReTry:function() {
      console.log('onReTry')
    },
    navToSearchPage:function(e:any) {
      console.log(e)
    },
    loadData: function() {
      if (!this.data.hasMore) return; // 如果没有更多数据，则不进行加载
      //wx.showLoading({ title: '加载中...' }); // 显示加载提示
      this.setData({loadingText:'加载中...'})
      const page = this.data.page;
      let floorGoods = this.data.floorGoods;
      wx.request({
        url: 'https://xinxinji.cn/stock/shop/list', // 替换为你的接口地址
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
      } else {
        wx.showToast({ title: '没有更多数据了', icon: 'none' }); // 提示没有更多数据了
      }
    },
    refresh:function(params:any) {
      params = params ? params : {};
      this.setData({hasMore:true, page:1, city: app.globalData.city, floorGoods: [{id:"1", name:"商品", goodsList: []}]});
      this.loadMoreData();
    }
  }
})