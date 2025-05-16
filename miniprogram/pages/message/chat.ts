import env from '../../config/env'
import service from '../../services/service';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    createdId:'',
    receiveId:'',
    pullDownRefreshing: 0,
    listLoading:0,
    page: 1,
    scrollViewClass:'scroll-view',
    mainscrolltop:0,
    keyBoardHeight: 0,
    messageList: [] as any,
    isRefresh: true,
    sandText:'',
    toView: '',
    isShowSendBtn : false,
    isHoldKeyboard: false,
    emptyImg: 'https://xinxinji.cn/images/miniapp/empty-order-list.jpg',
  },
  intervalId: 0 as number,
  socketTask: null as any,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options : any) {
    this.setData({ createdId : options.createdId, receiveId: options.receiveId, isHoldKeyboard: false});
    //延迟初始键盘保持.
    setTimeout(()=> {
      if (this.data.isHoldKeyboard == false) {
        this.setData({isHoldKeyboard : true});
      }
    }, 500);
    this.initEvent();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.fetchMessage();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    
  },
  /**
   * 初始化事件.
   */
  initEvent() {
    wx.onKeyboardHeightChange(res => {
      let keyBoardHeight = 1 < res.height ? res.height : res.height - 1;
      this.setData({keyBoardHeight : keyBoardHeight});
      this.gotoScrollBottom();
    });
  },

  connection() {
    const cache = env.getUserInfo();
    this.socketTask = wx.connectSocket({
      url: 'ws://127.0.0.1/ws/stock/websocket',
      timeout: 5000,
    });
    // 监听WebSocket连接打开事件
    this.socketTask.onOpen(function() {
      console.log('WebSocket连接已打开！');
    });
    // 监听WebSocket接受到服务器的消息事件
    this.socketTask.onMessage(function(data: any) {
      console.log('收到服务器内容：' + data.data);
    });
    // 监听WebSocket错误事件
    this.socketTask.onError(function(error: any) {
      console.error('WebSocket错误', error);
    });
  },
  /**
   * web socket 重试.
   */
  webSocketRetry() {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(()=> {
      if (this.socketTask && this.socketTask.readyState == this.socketTask.OPEN) {
        this.socketTask.send({
          data: 'PING',
          success (res: any) {
          },
          fail(err: any) {
          }
        });
      } else if (this.socketTask && this.socketTask.readyState >= this.socketTask.CLOSING) {

      } else {

      }
    }, 5000);
   },
   /**
    * 选择图片.
    * @param event 
    */
   bindChooseMedia(event: any) {
    wx.chooseMedia({
      count: 1,
      mediaType:['image', 'video'],
      success(res) {
        console.log(res.tempFiles[0].tempFilePath)
        console.log(res.tempFiles[0].size)
      }
    })
   },
  fetchMessage() {
    this.setData({listLoading: 1});
    let curPage = this.data.page;
    service.request({
      url: env.domain + '/stock/message/chats',
      method:'GET',
      encipherMode: 4,
      // checkAuthgoto: false,
      data: {page: this.data.page + '', createdId: this.data.createdId},
      header: {'X-Requested-With': 'XMLHttpRequest'},
      success: (res:any) => {
        this.data.page ++;
        let data = res.data;
        this.setData({pullDownRefreshing:0, 
            listLoading: data.length == 20 ? 0 : 2, 
            messageList: data.concat(this.data.messageList)
        }, ()=> {
          if (curPage == 1) {
            this.gotoScrollBottom();
            this.onUpdateRead();
          } else {
            this.setCalcScrollPostion(res.data);
          }
        });
      },
      fail:(err:any) => {
        this.setData({ pullDownRefreshing:0, listLoading: err.errno == 401 ? 0 : 3 });
      }
    });
  },
  /**
   * 计算滚动条应该在的位置.
   * @param data.
   */
  setCalcScrollPostion(data : any) {
    if (data.length > 0) {
      this.setData({
        toView: "id_" + data[data.length -1 ].id // 设置要滚动到的元素的id
      });
    }
  },

  /**
   * 设置滚动条置底部.
   */
  gotoScrollBottom() {
    const query = wx.createSelectorQuery();
    query.selectViewport().boundingClientRect();
    let that = this;
    try {
      query.select('.context-body').boundingClientRect(rect => {
        wx.pageScrollTo({
          selector: "context-body",
          scrollTop: rect.height, // 设置为0表示滚动到顶部，如果要精确控制位置可以使用计算后的值
          duration: 300, // 动画持续时间，单位ms
          complete(res: any ) {
            setTimeout(()=> {
              that.setData({scrollViewClass: 'scroll-view'});
            }, 500);
          }
        });
      });
      query.exec();
    } catch (e) {
      console.error(e);
    }

    // 或者使用 scrollIntoView 滚动到特定元素
    this.setData({
      toView: 'msg_end_flag' // 设置要滚动到的元素的id
    });
  },

  /**
   * 滚动顶部加载事件.
   * @param event 
   */
  onScrolltoupper(event: any) {
    if (this.data.listLoading == 0) {
      this.fetchMessage();
    }
  },

  /**
   * 输入更变事件.
   * @param event 
   */
  inputChangeHander(event: any) {
    let { value } = event.detail;
    this.data.sandText = value;
    if (0 < value.length  && this.data.isShowSendBtn == false) {
      this.setData({isShowSendBtn : true});
    } else if (0 == value.length && this.data.isShowSendBtn) {
      this.setData({isShowSendBtn : false});
    }
  },

  /**
   * 点击信息上下文.
   * @param event 
   */
  onClickContext(event: any) {
    wx.hideKeyboard({
      complete: res => {
        this.setData({ isHoldKeyboard : true});
      }
    });
  },

  /**
   * 发送事件处理.
   * @param event 
   */
  onSendMessage(event: any) {
    // const query = wx.createSelectorQuery();
    // let nodesRef = query.select('#inputTextarea');
    // query.exec();
    //const comp = this.selectComponent("#inputTextarea");
    let text = this.data.sandText.replace('/ /g', '');
    if (text == '') {
      wx.showToast({icon:'none', title:'发送内容不能为空'});
      return;
    }
    service.request({
      url: env.domain + '/stock/message/send',
      method:'POST',
      encipherMode: 4,
      data: {type:0, receiveId: this.data.createdId, content: this.data.sandText},
      header: {'X-Requested-With': 'XMLHttpRequest'},
      success: (res:any) => {
        if (res.data.code == 200) {
          this.setData({messageList:this.data.messageList.concat(res.data.data)});
          this.gotoScrollBottom();
        } else {
          wx.showToast({icon:'none', title:res.data.msg});
        }
      },
      fail:(err:any) => {
        
      }
    });
    this.setData({ sandText: '' , isShowSendBtn: false});
  },
  /**
   * 下拉.
   * @param event 
   */
  onCustomPullDownRefresh(event: any) {
    if (this.data.listLoading == 0) {
      this.fetchMessage();
    }
    this.setData({pullDownRefreshing: 0});
  },
  /**
   * 滚动加载事件.
   * @param event 
   */
  onScroll(event: any) {
    const { scrollTop } = event.detail;
    if (scrollTop ==0) {
      if (this.data.listLoading == 0) {
        this.fetchMessage();
      }
    }
  },

  /**
   * 更新已读.
   */
  onUpdateRead() {
    // const query = wx.createSelectorQuery();
    // let nodesRef = query.select('#inputTextarea');
    // query.exec();
    //const comp = this.selectComponent("#inputTextarea");
    service.request({
      url: env.domain + '/stock/message/read',
      method:'PUT',
      encipherMode: 4,
      data: {createdId: this.data.createdId, receiveId:this.data.receiveId},
      header: {'X-Requested-With': 'XMLHttpRequest'},
      success: (res:any) => {
       // console.log(res);
      },
      fail:(err:any) => {
        console.error(err);
      }
    });
  },

 /**
  * 页面返回
  */
 onBack() {
  this.data.isRefresh = false;
  this.setData({listLoading : 3});
  setTimeout(() => {
    this.data.isRefresh = true;
  }, 3000);
 },
 /**
  * 刷新.
  */
 onRefresh() {
  this.fetchMessage();
 },

 /**
  * 重新加载.
  * @param param 
  */
 onReTryLoad(param: any) {
    this.fetchMessage();
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
    clearInterval(this.intervalId);
    if (this.socketTask) {
      this.socketTask.close({code: 1000});
    }
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