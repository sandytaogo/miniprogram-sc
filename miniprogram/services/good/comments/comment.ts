import { config, domain } from '../../../config/env';
import service from '../../service';
import { queryCommentDetail } from '../../../model/comments/queryDetail';

export function uploadFile(params: any) {
  return new Promise((resolve) => {
    service.uploadFile({  
      url: domain + '/stock/upload',
      method: 'POST',
      name: 'meida',
      filePath:  params.url, 
      header: {'X-Requested-With': 'XMLHttpRequest'},
      success: (res: any) => {
        let resData = typeof res.data == 'string' ? JSON.parse(res.data) : res.data;
        if (resData.code == 200) {
          params.newName = resData.data[0].newName;
          resData.data = params;
          resolve(resData);
        } else if(resData) {
          resData.data = params;
          resolve(resData);
        }
      },
      fail: (err: any) => {
        console.error("上传失败" + err);
      }
    });
  });
};

/**
 * 提交评论信息.
 * @param {*} params 
 */
export function submitComment(params : any) {
  return new Promise((resolve) => {
    service.request({  
      url: domain + '/stock/comment',
      method: 'POST',
      data: params,
      header: {'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/json'},
      success: (res: any) => {
        resolve(res.data);
      },
      fail: (err: any) => {
        console.error("上传失败" + err);
      }
    });
  });
};

/** 获取商品评价数据 */
function mockQueryCommentDetail(params: any) {
  const { delay } = require('../../_utils/delay');
  const data = queryCommentDetail(params);
  return delay().then(() => {
    return data;
  });
}

/** 获取评价详情 */
export function getCommentDetail(params: any) {
  if (config.useMock) {
    return mockQueryCommentDetail(params);
  }
  return new Promise((resolve) => {
    resolve('real api');
  });
}
