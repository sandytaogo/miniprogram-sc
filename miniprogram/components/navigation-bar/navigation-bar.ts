Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    extClass: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    },
    background: {
      type: String,
      value: ''
    },
    color: {
      type: String,
      value: ''
    },
    back: {
      type: Boolean,
      value: true
    },
    loading: {
      type: Boolean,
      value: false
    },
    homeButton: {
      type: Boolean,
      value: false,
    },
    animated: {
      // 显示隐藏的时候opacity动画效果
      type: Boolean,
      value: true
    },
    show: {
      // 显示隐藏导航，隐藏的时候navigation-bar的高度占位还在
      type: Boolean,
      value: true,
      observer: '_showChange'
    },
    // back为true的时候，返回的页面深度
    showlogobg: {
      type: Boolean,
      value: false,
    },
    delta: {
      type: Number,
      value: 1
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    displayStyle: '',
    logoStyle:'',
  },
  lifetimes: {
    ready: function() {
      // wx.onAfterPageUnload(function(res:any){
      //     console.log('onAfterPageUnload:' + res)
      // })
    },
    created: function() {
      // console.log('组件被创建了');
    },
    attached() {
      // wx.getSystemInfo({
      //   success: (res) => {
      //     const isAndroid = res.platform === 'android'
      //     const isDevtools = res.platform === 'devtools'
      //     this.setData({ios: !isAndroid,
      //       innerPaddingRight:  `padding-right: ${res.windowWidth - rect.left}px;`,
      //       leftWidth: `width: ${res.windowWidth - rect.left }px`,
      //       safeHeightTop: `height: calc(35px + ${res.safeArea.top}px);`,
      //       safeAreaTop: isDevtools || isAndroid ? `height: calc(var(--height) + ${res.safeArea.top}px); padding-top: ${res.safeArea.top}px` : ``
      //     })
      //   }
      // })
      const rect = wx.getMenuButtonBoundingClientRect();
      const windowInfo = wx.getWindowInfo();
      const deviceInfo = wx.getDeviceInfo();
      const isAndroid = deviceInfo.platform === 'android';
      const isDevtools = deviceInfo.platform === 'devtools' || deviceInfo.platform === 'windows';
      if (windowInfo.safeArea.top == undefined || windowInfo.safeArea.top == 0) {
        windowInfo.safeArea.top = windowInfo.statusBarHeight > 0 ? windowInfo.statusBarHeight : 47;
      }
      this.setData({
        ios: !isAndroid,
        innerPaddingRight:  `padding-right: ${windowInfo.windowWidth - (rect.left < rect.right ? rect.left : rect.right) }px;`,
        leftWidth: `width: ${windowInfo.windowWidth - (rect.left < rect.right ? rect.left : rect.right) }px`,
        safeAreaTop: isDevtools || isAndroid ? `height: calc(${rect.height}px + ${rect.top}px); padding-top: ${rect.top}px` : ``,
       
        extClass: isAndroid || isDevtools ? 'android' : '',
        logoStyle: `height: calc(${rect.top}px + ${rect.height}px);`,
        platform: deviceInfo.platform,
      })
   
    },
    detached: function() {
     // console.log('组件被销毁了');
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toHomePage() {
      //wx.reLaunch({url: '/path/to/your/home/page'});  // 替换为你的主页路径
      //wx.redirectTo({url: '/path/to/your/home/page'});  // 替换为你的主页路径
      wx.switchTab({url: '/pages/index/index'});// 替换为你的主页路径
      //wx.navigateBack({delta: 999}); // 这里的数字代表需要回退的层数，999表示尽可能多地回退
    },
    _showChange(show: boolean) {
      const animated = this.data.animated
      let displayStyle = ''
      if (animated) {
        displayStyle = `opacity: ${show ? '1' : '0'};transition:opacity 0.5s;`
      } else {
        displayStyle = `display: ${show ? '' : 'none'}`
      }
      this.setData({displayStyle})
    },
    back() {
      const data = this.data
      if (data.delta) {
        wx.navigateBack({delta: data.delta})
      }
      this.triggerEvent('back', { delta: data.delta }, {})
    }
  }
})
