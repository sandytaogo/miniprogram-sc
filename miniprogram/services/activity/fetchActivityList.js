import { config } from '../../config/env';

/** 获取活动列表 */
function mockFetchActivityList(pageIndex = 1, pageSize = 20) {
  const { delay } = require('../_utils/delay');
  const { getActivityList } = require('../../model/activities');

  return delay().then(() => getActivityList(pageIndex, pageSize));
}

/** 获取活动列表 */
export function fetchActivityList(pageIndex = 1, pageSize = 20) {
  if (config.useMock || 1==1) {
    return mockFetchActivityList(pageIndex, pageSize);
  }

  return new Promise((resolve) => {
    resolve('real api');
  });
}
