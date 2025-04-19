import { config, domain } from '../../config/env';
import service from '../service';

/** 获取订单详情mock数据 */
function mockFetchOrderDetail(params: any) {
  const { delay } = require('../_utils/delay');
  const { genOrderDetail } = require('../../model/order/orderDetail');
  return delay().then(() => genOrderDetail(params));
}

/** 
 * 获取订单详情数据 
 */
export function fetchOrderDetail(params: any) {
  if (config.useMock) {
    return mockFetchOrderDetail(params);
  }

  return new Promise((resolve) => {
    service.request({
      url: domain + '/stock/order',
      method: 'get',
      data: params,
      encipherMode:4,
      header: {'X-Requested-With': 'XMLHttpRequest'},
      success:(res: any) => {
        resolve(res);
      },
      fail:(err:any) => {
        wx.hideLoading();
      }
    });
  });
}
/**
 * 完成订单.
 * @param params 
 */
export function completeOrder(params:any) {
  return new Promise((resolve) => {
    service.request({
      url: domain + '/stock/order/complete',
      method: 'POST',
      data: params,
      encipherMode: 4,                               
      header: {'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/json'},
      success:(res: any) => {
        resolve(res.data);
      },
      fail:(err:any) => {
        wx.hideLoading();
      }
    });
  });
}

/**
 * 取消订单.
 * @param params 
 */
export function cancelOrder (params:any) {
  return new Promise((resolve) => {
    service.request({
      url: domain + '/stock/order/cancel',
      method: 'put',
      data: params,
      encipherMode: 4,                               
      header: {'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/json'},
      success:(res: any) => {
        resolve(res.data);
      },
      fail:(err:any) => {
        wx.hideLoading();
      }
    });
  });
};

/** 获取客服mock数据 */
function mockFetchBusinessTime(params: any) {
  const { delay } = require('../_utils/delay');
  const { genBusinessTime } = require('../../model/order/orderDetail');
  return delay().then(() => genBusinessTime(params));
}

/** 获取客服数据 */
export function fetchBusinessTime(params: any) {
  if (config.useMock || true) {
    return mockFetchBusinessTime(params);
  }

  return new Promise((resolve) => {
    resolve('real api');
  });
}
