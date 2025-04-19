import { config, domain } from '../../config/env';
import service from '../../services/service';

/** 获取订单列表mock数据 */
function mockFetchOrders(params:any) {
  const { delay } = require('../_utils/delay');
  const { genOrders } = require('../../model/order/orderList');
  return delay(200).then(() => genOrders(params));
}

/** 
 * 获取订单列表数据
 * @param  params
 */
export function fetchOrders(params:any) {
  if (false) {
    return mockFetchOrders(params);
  }
  return new Promise((resolve) => {
    service.request({
      url:  domain + '/stock/order/list',
      method: 'get',
      data: params,
      header: {'X-Requested-With': 'XMLHttpRequest'},
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
 * 获取订单列表mock数据 
 * @param params 
 */
function mockFetchOrdersCount(params:any) {
  const { delay } = require('../_utils/delay');
  const { genOrdersCount } = require('../../model/order/orderList');
  return delay().then(() => genOrdersCount(params));
}

/** 
 * 获取订单列表统计
 * @param params  
 */
export function fetchOrdersCount(params:any) {
  if (config.useMock) {
    return mockFetchOrdersCount(params);
  }
  return new Promise((resolve) => {
    service.request({
      url:  domain + '/stock/order/count',
      method: 'get',
      data: params,
      encipherMode:4,
      header: {'X-Requested-With': 'XMLHttpRequest'},
      success:(res: any) => {
        resolve(res.data);
      },
      fail:(err:any) => {
        wx.hideLoading();
      }
    });
  });
}