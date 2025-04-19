import { config, domain } from '../../config/env';
import service from '../../services/service';
/** 获取个人中心信息 */
function mockFetchPerson() {
  const { delay } = require('../_utils/delay');
  const { genSimpleUserInfo } = require('../../model/usercenter');
  const { genAddress } = require('../../model/address');
  const address = genAddress();
  return delay().then(() => ({
    ...genSimpleUserInfo(),
    address: {
      provinceName: address.provinceName,
      provinceCode: address.provinceCode,
      cityName: address.cityName,
      cityCode: address.cityCode,
    },
  }));
}

/** 获取个人中心信息 */
export function fetchPerson() {
  if (config.useMock) {
    return mockFetchPerson();
  }
  return new Promise((resolve) => {
    service.request({
      'url': domain + '/user/u/person',
      method: 'GET',
      encipherMode:4,
      header: {'X-Requested-With': 'XMLHttpRequest'},
      success: (res:any) => {
        resolve(res.data);
      },
      fail: (err: any) => {
      }
    });
  });
}
