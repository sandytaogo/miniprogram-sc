/**
 * 用户昵称修改页面控制器 MIT
 * @author sandy
 * @version 1.0.0
 */

 import env from '../../../config/env';

Page({
  data: {
    nameValue: '',
  },
  onLoad(options:any) {
    const { name } = options;
    this.setData({
      nameValue: name,
    });
  },
  onSubmit() {
    wx.request({
      url: env.domain + '/user/u/updataeNickName',
      method:'PUT',
      data: {},
      success: (res:any) => {
        if (res.data.code == 200) {
          wx.navigateBack({ backRefresh: true });
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
  clearContent() {
    this.setData({
      nameValue: '',
    });
  },
});
