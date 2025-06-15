/* eslint-disable no-param-reassign */
import { config } from '../../config/env';
import service from '../service';

/** 
 * 获取搜索历史 
 * @param params.
 */
function mockSearchResult(params: any) {
  const { delay } = require('../_utils/delay');
  const { getSearchResult } = require('../../model/search');
  const data = getSearchResult(params);

  if (data.spuList.length) {
    data.spuList.forEach((item: any) => {
      item.spuId = item.spuId;
      item.thumb = item.primaryImage;
      item.title = item.title;
      item.price = item.minSalePrice;
      item.originPrice = item.maxLinePrice;
      if (item.spuTagList) {
        item.tags = item.spuTagList.map((tag: any) => ({ title: tag.title }));
      } else {
        item.tags = [];
      }
    });
  }
  return delay().then(() => {
    return data;
  });
}

/** 
 * 获取搜索历史 
 * @param params
 */
export function getSearchResult(params: any) {
  if (config.useMock) {
    return mockSearchResult(params);
  }
  return new Promise((resolve) => {
    service.request({
      url:  config.domain + '/stock/shopsearch/search',
      method:'GET',
      data: params,
      header: {'X-Requested-With': 'XMLHttpRequest'},
      success: (res:any) => {
        if (res.data && res.data.data.length) {
          res.data.data.forEach((item: any) => {
            item.spuId = item.spuId;
            item.thumb = item.primaryImage;
            item.title = item.title;
            item.price = item.minSalePrice;
            item.originPrice = item.maxLinePrice;
            if (item.spuTagList) {
              item.tags = item.spuTagList.map((tag: any) => ({ title: tag.title }));
            } else {
              item.tags = [];
            }
          });
        }
        resolve(res.data);
      },
      fail:(err:any) => {
        wx.hideLoading();
      }
    });
  });
}
