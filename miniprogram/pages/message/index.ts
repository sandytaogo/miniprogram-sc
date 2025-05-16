import env from '../../config/env'
import service from '../../services/service';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pullDownRefreshing: 0,
    listLoading:0,
    page: 0,
    messageList: [] as any,
    isBack: false,
    isBackend:false,
    isRefresh: false,
    emptyImg: 'https://xinxinji.cn/images/miniapp/empty-order-list.jpg',
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
    this.setData({page: 0, isRefresh: false, messageList: []});
    this.fetchMessage({page: this.data.page, isRefresh:this.data.isRefresh, listLoading: this.data.listLoading});
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if(this.data.isBack == true) {
      return;
    }
    let app = getApp();
    if (app.globalData.userInfo) {
      this.data.isRefresh = true;
      if (this.data.listLoading != 1) {
        this.fetchMessage({page: this.data.page, isRefresh:this.data.isRefresh, listLoading: this.data.listLoading});
      }
    }
  },

  fetchMessage(param : any) {
    if (param.isRefresh == false) {
      this.setData({listLoading: 1});
    }
    let page = param.isRefresh ? param.page : param.page + 1;
    page = param.listLoading == 2 ? page - 1 : page;
    if (page < 1) {page = 1;}
    service.request({
      url: env.domain + '/stock/message/list',
      method:'GET',
      encipherMode: 4,
      data: { page:  page + '', t: Date.now() + '' },
      header: {'X-Requested-With': 'XMLHttpRequest'},
      success: (res:any) => {
        if (typeof res.data == 'object') {
          if (param.isRefresh) {
            let newData = [], isnew = false;
            for (let i = 0; i < res.data.length; i++) {
              isnew = true;
              for (let j =0; j < this.data.messageList.length; j++) {
                if (this.data.messageList[j].id == res.data[i].id) {
                  this.data.messageList[j] = res.data[i];
                  isnew = false;
                  break;
                }
              }
              //新数据加入新队列.
              if (isnew) {
                newData.push(res.data[i]);
              }
            }
            this.setData({isRefresh:false, pullDownRefreshing:0, messageList:newData.concat(this.data.messageList)});
            this.fetchMessageCount();
          } else {
            this.data.page ++;
            this.setData({pullDownRefreshing:0, isRefresh:false, listLoading: res.data.length == 20 ? 0 : 2, 
                messageList:this.data.messageList.concat(res.data) }, () => {
              if (res.data.length > 0) {
                this.fetchMessageCount();
              }
            });
          }
        } else {
          this.setData({ isRefresh:false, pullDownRefreshing:0, listLoading:0 });
        }
      },
      fail:(err:any) => {
        this.setData({ isRefresh:false, pullDownRefreshing:0, listLoading: err.errno == 401 ? 0 : 3 });
      }
    });
  },

  /**
   * 查询消息总条数.
   */
  fetchMessageCount() {
    service.request({
      url: env.domain + '/stock/message/unreadCount',
      method:'GET',
      checkAuthgoto: false,
      header: {'X-Requested-With': 'XMLHttpRequest'},
      success: (res:any) => {
        if (typeof res.data == 'number' && res.data > 0) {
          wx.setTabBarBadge({index: 2, text: `${res.data}`});
        } else {
          wx.removeTabBarBadge({index: 2 });
        }
      }
    });
  },

  /**
   * 滚动条底部事件.
   * @param event 
   */
  onScrolltolower(event: any) {
    if (this.data.listLoading == 0) {
      this.fetchMessage({page: this.data.page, isRefresh:this.data.isRefresh, listLoading: this.data.listLoading});
    }
 },

 /**
  * 页面返回
  */
 onBack() {
   this.setData({pullDownRefreshing:0, listLoading: 0, page: 0});
  this.data.isBack = true;
  setTimeout(() => {
    this.data.isBack = false;
  }, 3000);
 },
 /**
  * 重新加载.
  * @param param 
  */
 onReTryLoad(param: any) {
  if (this.data.listLoading == 0) {
    this.fetchMessage({page: this.data.page, isRefresh:this.data.isRefresh, listLoading: this.data.listLoading});
  }
 },

 /**
  * 打开聊天窗口.
  * @param event 
  */
 onToChatEvent(event: any) {
  let dataset = event.currentTarget.dataset;
  wx.navigateTo({url: `/pages/message/chat?receiveId=${dataset.receiveId}&createdId=${dataset.createdId}`});
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
  * 刷新.
  */
  onRefresh() {
    if (this.data.listLoading == 0) {
      this.data.isRefresh = true;
      this.fetchMessage({page: this.data.page, isRefresh:this.data.isRefresh, listLoading: this.data.listLoading});
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },

  /**
 * 自定义下拉刷新事件.
 * @param event 
 */
  onCustomPullDownRefresh(event: any) {
    if (this.data.listLoading != 1) {
      this.setData({ pullDownRefreshing:0, page:0, listLoading:0, messageList:[] });
      this.fetchMessage({page: this.data.page, isRefresh:this.data.isRefresh, listLoading: this.data.listLoading});
    }
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