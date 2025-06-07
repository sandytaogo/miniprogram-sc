import env from '../../../config/env';
import service from '../../../services/service';
import { fetchPerson } from '../../../services/user/fetchPerson';
import { phoneEncryption } from '../../../utils/util';
import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    personInfo: {
      avatarUrl: 'https://xinxinji.cn/images/avatar/user-avatar2x.png',
      nickName: '',
      gender: 0,
      phoneNumber: '',
    },
    showUnbindConfirm: false,
    pickerOptions: [
      {name: '男',code: '1'},
      {name: '女', code: '2'}
    ],
    typeVisible: false,
    genderMap: ['', '男', '女'],
  },
  onLoad() {
    this.init();
  },
  init() {
    this.fetchData();
  },
  fetchData() {
    fetchPerson().then((personInfo: any) => {
      this.setData({personInfo, 'personInfo.phoneNumber': phoneEncryption(personInfo.phoneNumber)});
    });
  },
  onClickCell({ currentTarget }) {
    const { dataset } = currentTarget;
    const { nickName } = this.data.personInfo;
    switch (dataset.type) {
      case 'gender':
        this.setData({typeVisible: true});
        break;
      case 'name':
        wx.navigateTo({url: `/pages/user/name-edit/index?name=${nickName}` });
        break;
      case 'avatarUrl':
        this.toModifyAvatar();
        break;
      default: {
        break;
      }
    }
  },

  /**
   * 更新用户昵称.
   * @param user 
   */
  onUpdateNickNameObserver(user: any) {
    this.data.personInfo.nickName = user.nickName;
    this.setData({personInfo: this.data.personInfo});
  },
  onGenderConfirm(event: any) {
    const { value } = event.detail;
    this.setData({typeVisible: false,'personInfo.gender': value}, () => {
      Toast({context: this,selector: '#t-toast',message: '设置成功',theme: 'success'});
    });
  },
  /**
   * 性别关闭窗口.
   */
  onGenderClose() {
    this.setData({typeVisible: false});
  },
  async toModifyAvatar() {
    try {
      const tempFilePath = await new Promise((resolve, reject) => {
        wx.chooseMedia({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success: (res) => {
            const { tempFilePath, size } = res.tempFiles[0];
            if (size <= 1485760) {
              service.uploadFile({
                url: env.domain + '/user/u/avatar',
                name : 'image',
                encipherMode: 4,
                filePath:  tempFilePath,
                success:(res: any) => {
                  let resData = res.data;
                  if (resData.code == 200) {
                    let user_data = env.getUserInfo();
                    this.setData({personInfo: resData.data});
                    if (user_data) {
                      user_data.userInfo.avatarUrl = resData.data.avatarUrl;
                      env.setUserInfo(user_data);
                    }
                  }
                },
                fail: (err: any) => {
                  console.error("上传失败" + err);
                }
              });
              resolve(tempFilePath);
            } else {
              reject({ errMsg: '图片大小超出限制，请重新上传' });
            }
          },
          fail: (err) => reject(err),
        });
      });
     // const tempUrlArr = tempFilePath.split('/');
      //const tempFileName = tempUrlArr[tempUrlArr.length - 1];
      //Toast({ context: this,selector: '#t-toast',message: `已选择图片-${tempFileName}`,theme: 'success' });
    } catch (error) {
      if (error.errMsg === 'chooseImage:fail cancel' || error.errMsg === 'chooseMedia:fail cancel') return;
      Toast({context: this,selector: '#t-toast',message: error.errMsg || error.msg || '修改头像出错了', theme: 'error' });
    }
  },
  /**
   * 确认事件.
   * @param event 
   */
  onConfirm(event: any) {
    service.request({
      url: env.domain + '/user/u/updatePerson',
      method:'PUT',
      data: this.data.personInfo,
      encipherMode: 4,
      header: {'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/json'},
      success: (res:any) => {
        if (res.data.code == 200) {
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
  }
});
