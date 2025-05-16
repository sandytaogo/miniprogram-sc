/**
 * license MIT.
 * @author sandy
 * @since 1.0.0 2025-03-31 12:12:12
 */
import env from '../config/env';
import { sm2, sm4 } from 'sm-crypto';

/**
 * 网络通信统一封装 encipherMode:2 sm2 ， encipherMode:3 sm3， encipherMode:4 sm4  .
 * @param params [encipherMode: 2, 3, 4 ]
 * @author sandy
 */
const request = function(params: any) {
  const cache = env.getUserInfo();
  let success = params.success;
  let fail = params.fail;
  if (params.method == 'get' || params.method == 'GET') {
    params.data = requestGetEncrypt(params.data, params.encipherMode, cache);
  } else {
    params.data = requestEncrypt(params.data, params.encipherMode, cache);
  }
  let requestParam = {...params,
    success: (res: any) => {
      res = responeDecrypt(res, params.encipherMode, cache);
      if (res.data.code == 401) {
        if (params.checkAuth === false && fail) {
          fail( {errno: res.data.code, errMsg: res.data.msg});
        } else {
          refreshToken(params);
        }
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

const jsonParse = function(data: any) {
  try {
    if (typeof data == 'string') {
      return JSON.parse(data);
    }
  } catch (e) {
      //ignore.
  }
  return data;
}

/**
 * 上传文件.
 * @param params 
 */
const uploadFile = function(params: any) {
  let cache = env.getUserInfo();
  let success = params.success;
  let fail = params.fail;
  let requestParam = {...params,
    success: (res: any) => {
      res.data = jsonParse(res.data);
      if (res.data.code == 401) {
        if (params.checkAuth === false && success) {
          success(res);
        } else {
          refreshToken(params);
        }
      } else if (success) {
        if (typeof res.data == 'string' && res.data.indexOf('\"') == 0) {
          res.data = res.data.substring(1, res.data.length -1);
        }
        res = responeDecrypt(res, params.encipherMode, cache);
        success(res);
      }
    },
    fail: (err:any) => {
      if (fail) {
        fail(err);
      }
    }
  };

  if (cache) {
    if (requestParam.header) {
      requestParam.header['Cookie'] = cache.cookie;
    } else {
      requestParam.header = {'Cookie' : cache.cookie};
    }
  }
  wx.uploadFile(requestParam);
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
      if (typeof res.data == 'string') {
        try {
          if (res.data.substring(0, 2) == "04") {
            res.data = res.data.substring(2, res.data.length);
          }
          res.data = sm2.doDecrypt(res.data, info.privateKey, 0);
          res.data = JSON.parse(res.data);
        } catch (e) {
          res.data = {code: 401};
        }
      }
      if (res.data.code == 401) {
        let app = getApp();
        app.setData({userInfo: null});
        env.setUserInfo(null);
        if (params.checkAuthgoto == false) {
          if (params.fail) {
            params.fail( {errno: res.data.code, errMsg: res.data.msg});
          }
          return;
        }
        wx.navigateTo({url: '/pages/auth/login/login'});
      } else if (res.data.code == 200) {
        if (res.header['Set-Cookie']) {
          info.cookie = res.header['Set-Cookie'];
        }
        info.accessToken = res.data.data.accessToken;
        info.server.sm4 = res.data.data.sm4;
        info.server.publickey =  res.data.data.publickey;
        env.setUserInfo(info);
        if (params) {
          retryRequest(params);
        }
      }
    }
  });
};
/**
 * 会话失效修复后的重试
 * @param params 
 */
const retryRequest = function (params: any) {
  const cache = env.getUserInfo();
  let success = params.success;
  let fail = params.fail;
  let requestParam = {...params,
    success: (res: any) => {
      if (success) {
        res = responeDecrypt(res, params.encipherMode, cache);
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
  wx.request(requestParam);
}

/**
 * 网络请求编码处理.
 * @param data 
 * @param encipherMode [encipherMode: 2, 3, 4 ] encipherMode:2 sm2 ， encipherMode:3 sm3， encipherMode:4 sm4 .
 * @param key 
 */
const requestEncrypt = function(data: any, encipherMode: number, key: any) {
  if (data && key) {
    switch (encipherMode) {
      case 2 : data = sm2.doEncrypt(JSON.stringify(data), key.privatekey, 0); break;
      case 4 : data = sm4.encrypt(JSON.stringify(data), key.server.sm4); break;
    }
  }
  return data;
};

/**
 * 网络请求编码处理 method[GET].
 * @param data 
 * @param encipherMode [encipherMode: 2, 3, 4 ] encipherMode:2 sm2 ， encipherMode:3 sm3， encipherMode:4 sm4 .
 * @param key 
 */
const requestGetEncrypt = function(data: any, encipherMode: number, key: any) {
  if (data && key) {
    for (let propertyName in data) {
      if (data.hasOwnProperty(propertyName))
      switch (encipherMode) {
        case 2 : data[propertyName] = sm2.doEncrypt(data[propertyName], key.privatekey, 0); break;
        case 4 : data[propertyName] = sm4.encrypt(data[propertyName], key.server.sm4); break;
      }
    }
  }
  return data;
};

/**
 * 响应数据解码处理.
 * @param res result.
 * @param encipherMode [encipherMode: 2, 3, 4 ] encipherMode:2 sm2 ， encipherMode:3 sm3， encipherMode:4 sm4 .
 * @param key user key.
 */
const responeDecrypt = function(res : any, encipherMode: number, key: any) {
  if (res.data.code == 401) {
    return res;
  }
  if (res.data == undefined || res.data == '') {
    return res;
  }
  try {
    switch (encipherMode) {
      case 2 : res.data = sm2.doDecrypt(res.data, key.privatekey, 0); break;
      case 4 : res.data = sm4Decrypt(res.data, key.server.sm4); break;
    }
  } catch (e) {
    console.error(e);
    //res.data = {code: 401};
  }
  return res;
};

/**
 * 国产sm4椭圆算法解码.
 * @param data 
 * @param key 
 */
const sm4Decrypt = function(data: string,  key: string) {
  let res = sm4.decrypt(data, key);
  return JSON.parse(res);
}

export default {
  request : request,
  uploadFile: uploadFile,
  refreshToken:refreshToken,
}

module.exports = {
  request : request,
  uploadFile: uploadFile,
  refreshToken:refreshToken,
}
