import {uploadFile, submitComment, getCommentDetail } from '../../../../services/good/comments/comment';
import Toast from 'tdesign-miniprogram/toast/index';
Page({
  textAreaValue: '',
  data: {
    serviceRateValue: 1,
    goodRateValue: 1,
    conveyRateValue: 1,
    isAnonymous: false,
    uploadFiles: [] as any,
    gridConfig: {
      width: 218,
      height: 218,
      column: 3,
    },
    isAllowedSubmit: false,
    goodsId:'',
    storeId:'',
    imgUrl: '',
    title: '',
    goodsDetail: '',
    imageProps: {
      mode: 'aspectFit',
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    this.setData({
      storeId:options.storeId, 
      goodsId:options.goodsId, 
      imgUrl: options.imgUrl, 
      title: options.title, 
      goodsDetail: options.specs 
    });
  },
 
  /**
   * 服务比率.
   * @param event.
   */
  onRateChange(event: any) {
    const { value } = event?.detail;
    const item = event?.currentTarget?.dataset?.item;
    this.setData({ [item]: value }, () => {
      this.updateButtonStatus();
    });
  },
  /**
   * 匿名评论选择.
   * @param {*} event 
   */
  onAnonymousChange(event: any) {
    const status = !!event?.detail?.checked;
    this.setData({ isAnonymous: status });
  },
  /**
   * 处理成功文件.
   * @param {*} event. 
   */
  handleSuccess(event: any) {
    const { files } = event.detail;
    for (let i =0; i < files.length; i++) {
      let row = files[i];
      if (row.newName) {
        continue;
      }
      uploadFile(row).then((res: any) => {
        if (res.code == 200) {
          row = res.data;
        } else {
          Toast({context: this, selector: '#t-toast', message: res.msg, icon: 'check-circle'});
        }
      });
    }
    this.setData({uploadFiles: files});
  },
  /**
   * 移除文件的处理.
   * @param {*} event 
   */
  handleRemove(event: any) {
    const { index } = event.detail;
    const { uploadFiles } = this.data;
    uploadFiles.splice(index, 1);
    this.setData({uploadFiles});
  },
  /**
   * 评论内容监听器.
   * @param {*} event 
   */
  onTextAreaChange(event: any) {
    let value = event?.detail?.value;
    this.textAreaValue = value;
    this.updateButtonStatus();
  },
  /**
   * 评论按钮状态监听控制.
   */
  updateButtonStatus() {
    const { serviceRateValue, goodRateValue, conveyRateValue, isAllowedSubmit } = this.data;
    const { textAreaValue } = this;
    const temp = 0 < serviceRateValue && 0 < goodRateValue && 0 < conveyRateValue && textAreaValue != '';
    if (temp !== isAllowedSubmit) {
      this.setData({ isAllowedSubmit: temp });
    }
  },
  /**
   * 提交评论按钮事件.
   */
  onSubmitBtnClick() {
    const { isAllowedSubmit } = this.data;
    if (!isAllowedSubmit) return;
    let iamges = [] as any;
    for (let key in this.data.uploadFiles) {
      let uploadFile = this.data.uploadFiles[key];
      if (uploadFile.newName == undefined) {
        Toast({context: this, selector: '#t-toast', message: uploadFile.name + '-未完成', icon: 'check-circle'});
        return ;
      }
      iamges.push(uploadFile.newName);
    }
    let submitData = {
      storeId: this.data.storeId,
      goodsId: this.data.goodsId,
      commentLevel: this.data.goodRateValue,
      content: this.textAreaValue,
      images:iamges,
      isAnonymous: this.data.isAnonymous,
      logisticsLevel: this.data.conveyRateValue,
      serviceLevel:this.data.serviceRateValue,
    };
    submitComment(submitData).then((res: any) => {
      if (res.code == 200) {
        Toast({context: this, selector: '#t-toast', message: '评价提交成功', icon: 'check-circle'});
        wx.navigateBack({ delta: 1 });
      }
    });
  }
});
