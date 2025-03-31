import env from '../../../../config/env'

let addressPromise:any = [];

/** 地址编辑Promise */
export const getAddressPromise = () => {
  let resolver;
  let rejecter;
  const nextPromise = new Promise((resolve, reject) => {
    resolver = resolve;
    rejecter = reject;
  });
  addressPromise.push({ resolver, rejecter });
  return nextPromise;
};

/** 用户保存了一个地址 */
export const resolveAddress = (address:any) => {
  const allAddress = [...addressPromise];
  addressPromise = [];
  const cache = env.getUserInfo();
  wx.showLoading({title:'保存中...'});
  wx.request({
    url: env.domain + '/user/address',
    data : address,
    method: address.id ? 'PUT' : 'POST',
    header:{Cookie: cache.cookie},
    success: (res: any) => {
      wx.hideLoading();
      if (res.data.code == 200) {
        wx.navigateBack({ delta: 1 });
        allAddress.forEach(({ resolver }) => resolver(address));
      } else {
        wx.showToast({icon: 'none', title: res.data.msg});
      }
    },
    fail: (err:any) => {
      wx.hideLoading();
      wx.showToast({icon: 'none', title: '保存失败'})
    }
  });
  
};

/** 取消编辑 */
export const rejectAddress = () => {
  const allAddress = [...addressPromise];
  addressPromise = [];
  allAddress.forEach(({ rejecter }) => rejecter(new Error('cancel')));
};
