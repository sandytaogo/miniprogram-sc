/**
 * MIT License
 * Copyright (c) 2024 sandy
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal 
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * @author taoxiaofang
 * @since 1.0.0 2025-01-07 12:12:12
 */

//const domain = "http://127.0.0.1";
//const domain = "http://172.27.240.1";
const domain = "https://xinxinji.cn";
/**
 * Content Delivery Network
 */
//const cdn = "http://127.0.0.1";
const cdn = "https://xinxinji.cn";

export const config = {
  /** 是否使用mock代替api返回 */
  useMock: false
};

/**
 * 获取用户信息， 来源用户缓存.
 */
const getUserInfo =  function() {
  let userData = wx.getStorageSync('sandy_sc_user_safe_info');
  if (userData == '' || userData == undefined) {
    return null;
  }
  return userData;
};
const setUserInfo = function(params: any) {
  wx.setStorageSync('sandy_sc_user_safe_info', params);
};

export default {
  config:config,
  domain:domain,
  cdn:cdn,
  getUserInfo:getUserInfo,
  setUserInfo:setUserInfo,
}

module.exports = {
  domain:domain,
  cdn:cdn,
  config:config,
  getUserInfo:getUserInfo,
  setUserInfo:setUserInfo,
}