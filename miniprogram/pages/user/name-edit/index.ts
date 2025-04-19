/**
 * 用户昵称修改页面控制器 MIT
 * @author sandy
 * @version 1.0.0
 */
 import env from '../../../config/env';
 import service from '../../../services/service';
Page({
  data: {
    nameValue: '',
  },
  onLoad(options:any) {
    const { name } = options;
    this.setData({nameValue: name});
  },
  onSubmit() {
    service.request({
      url: env.domain + '/user/u/updatePerson',
      method:'PUT',
      data: {nickName: this.data.nameValue},
      encipherMode: 4,
      header: {'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/json'},
      success: (res:any) => {
        if (res.data.code == 200) {
          this.data.nameValue = res.data.data.nickName;
          this.onBackCallback();
          wx.navigateBack({ delta:1 }); //backRefresh: true
        }
      },
      fail:(err: any) => {
        wx.hideLoading();
        if (err.errMsg == 'request:fail timeout') {
          wx.showToast({icon:'none', title:'修改超时'});
        } else {
          wx.showToast({icon:'none', title:err.errMsg});
        }
      }
    });
  },
  /**
   * 更新成功更新上层页面.
   */
  onBackCallback() {
    let currentPages = getCurrentPages();
    if (1 < currentPages.length) {
      let currentPage = currentPages[currentPages.length - 2];
      if (currentPage.onUpdateNickNameObserver) {
        currentPage.onUpdateNickNameObserver({nickName: this.data.nameValue});
      }
    }
  },
  clearContent() {
    this.setData({nameValue: ''});
  }
});
