// components/loading/index.ts
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    status: {
      type: Number,
      value: 0,
    },  
    loadingText: {
      type: String,
      value: '加载中...',
    },
    noMoreText: {
      type: String,
      value: '已经到底啦',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  lifetimes: {
    created: function() {
      console.log('组件被创建了');
      wx.createIntersectionObserver().relativeToViewport({bottom: 10}).observe('.load-more', (res) => {
       console.log(343);
      });
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onRetryHandle() {
      this.triggerEvent('onRetry');
    }
  }
})