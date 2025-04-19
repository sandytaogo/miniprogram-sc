import { config, domain } from '../../config/env';
import { mockIp, mockReqId } from '../../utils/mock';
import service from '../service'

/** 
 * 获取结算mock数据 
 * @param params.
 */
function mockFetchSettleDetail(params: any) {
  const { delay } = require('../_utils/delay');
  const { genSettleDetail } = require('../../model/order/orderConfirm');
  return delay().then(() => genSettleDetail(params));
}

/** 
 * 提交mock订单 
 * @param params.
 */
function mockDispatchCommitPay(prams: any) {
  const { delay } = require('../_utils/delay');

  return delay().then(() => ({
    data: {
      isSuccess: true,
      tradeNo: '350930961469409099',
      payInfo: '{}',
      code: null,
      transactionId: 'E-200915180100299000',
      msg: null,
      interactId: '15145',
      channel: 'wechat',
      limitGoodsList: null,
    },
    code: 'Success',
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 891,
    success: true,
  }));
}

/**
 * 获取结算数据 
 * @param {*} params 
 */
export function fetchSettleDetail(params: any) {
  if (config.useMock) {
    return mockFetchSettleDetail(params);
  }
  return new Promise((resolve) => {
    service.request({
      'url': domain + '/stock/order/settle',
      method: 'POST',
      data: params,
      encipherMode: 4,
      header: {'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/json'},
      success: (res: any) => {
        resolve(res.data);
      },
      fail: (err: any) => {
        console.error(err);
      }
    });
  });
}

/* 提交订单 */
export function dispatchCommitPay(params: any) {
  if (config.useMock) {
    return mockDispatchCommitPay(params);
  }
  return new Promise((resolve) => {
    service.request({
      'url': domain + '/stock/order',
      data: params,
      method: 'POST',
      encipherMode: 4,
      header: {'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/json'},
      success: (res: any) => {
        resolve(res.data);
      },
      fail: (err: any) => {
      }
    });
  });
}

/** 开发票 */
export function dispatchSupplementInvoice() {
  if (config.useMock) {
    const { delay } = require('../_utils/delay');
    return delay();
  }
  return new Promise((resolve) => {
    resolve('real api');
  });
}
