/**
 * listenr  MIT.
 */

import env from '../config/env'

/**
 * 网络通信统一封装.
 * @param params 
 * @author sandy
 */
const request = function(params: any) {
  const cache = env.getUserInfo();
  let success = params.success;
  let fail = params.fail;
  let requestParam = {...params,
    success: (res: any) => {
      if (params.authCheck === false && success) {
        success(res);
      } else if (res.data.code == 401) {
        refreshToken(params);
      } else if (success) {
        success(res);
      }
    },
    fail: (err:any) => {
      if (fail) {
        fail(err);
      }
    }
  }
  if (cache) {
    if (requestParam.header) {
      requestParam.header['Cookie'] = cache.cookie;
    } else {
      requestParam.header = {'Cookie' : cache.cookie};
    }
  }
  //requestParam.header['X-Requested-With'] = 'XMLHttpRequest';
  wx.request(requestParam);
};

/**
 * 刷新用户凭证令牌.
 * @param params 
 */
const refreshToken = function(params: any) {
  let info = env.getUserInfo();
  wx.request({
    url: env.domain + '/user/u/refreshToken', // 替换为你的接口地址
    method: 'PUT',
    header: {
      'Cookie' : info ? info.cookie : '',
      'refreshToken': info ? info.refreshToken : ''
    },
    success: (res:any) => {
      if (res.data.code == 401) {
        wx.navigateTo({url: '/pages/auth/login/login'});
      } else if (res.data.code == 200) {
        if (res.header['Set-Cookie']) {
          info.cookie = res.header['Set-Cookie'];
        }
        info.accessToken = res.data.data.accessToken;
        env.setUserInfo(info);
        if (params) {
          retryRequest(params);
        }
      }
    }
  });
};
/**
 *  重试
 * @param params 
 */
const retryRequest = function (params: any) {
  const cache = env.getUserInfo();
  let success = params.success;
  let fail = params.fail;
  let requestParam = {...params,
    success: (res: any) => {
      if (success) {
        success(res);
      }
    },
    fail: (err:any) => {
      if (fail) {
        fail(err);
      }
    }
  }
  if (cache) {
    if (requestParam.header) {
      requestParam.header['Cookie'] = cache.cookie;
    } else {
      requestParam.header = {'Cookie' : cache.cookie};
    }

  }
  //requestParam.header['X-Requested-With'] = 'XMLHttpRequest';
  wx.request(requestParam);
}

export default {
  request : request,
  refreshToken:refreshToken,
}

module.exports = {
  request : request,
  refreshToken:refreshToken,
}
