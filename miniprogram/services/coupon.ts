import env, { config } from '../config/env';
import service from '../services/service';

let useMock = config.useMock;
//useMock = true;
/** 获取优惠券列表 */
function mockFetchCoupon(status: any) {
  const { delay } = require('_utils/delay');
  const { getCouponList } = require('../model/coupon');
  return delay().then(() => getCouponList(status));
}

/** 获取优惠券列表 */
export function fetchCouponList(status = 0) {
  if (useMock) {
    return mockFetchCoupon(status);
  }
  return new Promise((resolve) => {
    service.request({
      'url': env.domain + '/stock/coupon/list',
      method: 'GET',
      encipherMode:4,
      data: {status:status + ''},
      header: {'X-Requested-With': 'XMLHttpRequest'},
      success: (res:any) => {
        resolve(res.data);
      },
      fail: (err: any) => {
      }
    });
  });
}

/** 获取优惠券 详情 */
function mockFetchCouponDetail(id, status) {
  const { delay } = require('_utils/delay');
  const { getCoupon } = require('../model/coupon');
  const { genAddressList } = require('../model/address');

  return delay().then(() => {
    const result = {
      detail: getCoupon(id, status),
      storeInfoList: genAddressList(),
    };

    result.detail.useNotes = `1个订单限用1张，除运费券外，不能与其它类型的优惠券叠加使用（运费券除外）\n2.仅适用于各区域正常售卖商品，不支持团购、抢购、预售类商品`;
    result.detail.storeAdapt = `商城通用`;

    if (result.detail.type === 'price') {
      result.detail.desc = `减免 ${result.detail.value / 100} 元`;

      if (result.detail.base) {
        result.detail.desc += `，满${result.detail.base / 100}元可用`;
      }

      result.detail.desc += '。';
    } else if (result.detail.type === 'discount') {
      result.detail.desc = `${result.detail.value}折`;

      if (result.detail.base) {
        result.detail.desc += `，满${result.detail.base / 100}元可用`;
      }

      result.detail.desc += '。';
    }

    return result;
  });
}

/** 获取优惠券 详情 */
export function fetchCouponDetail(id, status = 'default') {
  if (useMock) {
    return mockFetchCouponDetail(id, status);
  }
  return new Promise((resolve) => {
    service.request({
      'url': env.domain + '/stock/coupon',
      method: 'GET',
      encipherMode:4,
      data: { id:id },
      header: {'X-Requested-With': 'XMLHttpRequest'},
      success: (res:any) => {
        resolve(res.data);
      },
      fail: (err: any) => {
      }
    });
  });
}
