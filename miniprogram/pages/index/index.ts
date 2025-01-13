// index.ts
// 获取应用实例
const app = getApp<IAppOption>()
Component({
  data: {
    background: ['demo-text-1', 'demo-text-2'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    channel: [
      {id:"1", name:"测试", url:"", icon_url:"/images/icon_collect_checked.png"},
      {id:"2", name:"测试2", url:"", icon_url:"/images/icon_collect_checked.png"},
      {id:"3", name:"测试3", url:"", icon_url:"/images/icon_collect_checked.png"},
      {id:"4", name:"测试4", url:"", icon_url:"/images/icon_collect_checked.png"},
      {id:"5", name:"更多", url:"", icon_url:"/images/menu_sort_pressed.png"}
    ]
  },
  method:{
      
  }
})
