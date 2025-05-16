/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
    regionId: number,
    city: String,
    longitude?: number | undefined,
    latitude?: number | undefined,
    speed?: number | undefined,
    accuracy?:number | undefined,
    other: any,
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
  setData(param: any):void,

  timedTaskStart() : void,
}