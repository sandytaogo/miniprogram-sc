import { config, domain } from '../../config/env';
import service from '../../services/service'

/** 
 * 获取收货地址列表 
 * @param len length.
 */
function mockFetchDeliveryAddressList(len = 0) {
  const { delay } = require('../_utils/delay');
  const { genAddressList } = require('../../model/address');
  return delay().then(() =>
    genAddressList(len).map((address: any) => {
      return {
        ...address,
        phoneNumber: address.phone,
        address: `${address.provinceName}${address.cityName}${address.districtName}${address.detailAddress}`,
        tag: address.addressTag,
      };
    }),
  );
}

/** 
 * 获取收货地址列表.
 * @param len length.
 */
export function fetchDeliveryAddressList(len = 10) {
  if (config.useMock) {
    return mockFetchDeliveryAddressList(len);
  }
  return new Promise((resolve) => {
    wx.showLoading({title:'加载中...'});
    service.request({
      url: domain + '/user/address/list',
      method:'GET',
      encipherMode: 4,
      header: {'X-Requested-With': 'XMLHttpRequest'},
      success: (res:any) => {
        wx.hideLoading();
        res.data.data = res.data.data.map((address: any) => {
          return {...address, phoneNumber: address.phone,
            address: `${address.provinceName}${address.cityName}${address.districtName}${address.detailAddress}`,
            tag: address.addressTag,
          };
        });
        resolve(res.data.data);
      },
      fail:(err:any) => {
        wx.hideLoading();
      }
    });
  });
}


/**
 * 获取收货地址
 * @param id.
 */
function mockFetchDeliveryAddress(id: string) {
  const { delay } = require('../_utils/delay');
  const { genAddress } = require('../../model/address');
  return delay().then(() => genAddress(id));
}

/**
 * 获取收货地址
 * @param id.
*/
export function fetchDeliveryAddress(id:string) {
  if (config.useMock) {
    return mockFetchDeliveryAddress(id);
  }
  return new Promise((resolve) => {
    wx.showLoading({title:'加载中...'});
    service.request({
      url: domain + '/user/address',
      method:'GET',
      data: {id: id},
      encipherMode: 4,
      header: {'X-Requested-With': 'XMLHttpRequest'},
      success: (res:any) => {
        wx.hideLoading();
        resolve(res.data);
      },
      fail:(err:any) => {
        wx.hideLoading();
      }
    });
  });
}

/**
 * 删除收货地址.
 * @param params 
 */
export function deleteAddress(params: any) {
  return new Promise((resolve) => {
    service.request({
      url: domain + '/user/address/' + params.id,
      method:'DELETE',
      header: {'X-Requested-With': 'XMLHttpRequest'},
      success: (res:any) => {
        wx.hideLoading();
        resolve(res.data);
      },
      fail:(err:any) => {
        wx.hideLoading();
      }
    });
  });
}