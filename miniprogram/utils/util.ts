import { sm2 } from 'sm-crypto';

let keypair = sm2.generateKeyPairHex();
let publicKey = keypair.publicKey; // 公钥
let privateKey = keypair.privateKey; // 私钥
console.log(publicKey)

export default (date: Date) => {
  return date;
}

export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return ([year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':'))
}

const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}

/**
 * 手机号正则校验
 * @param phone 手机号
 * @param phoneReg 正则字符串
 * @returns true - 校验通过 false - 校验失败
 */
const phoneRegCheck = (phone:any) => {
  // 内置手机号正则字符串
  const innerPhoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$';
  const phoneRegExp = new RegExp(innerPhoneReg);
  return phoneRegExp.test(phone);
};

/**
 * 手机号码*加密函数
 * @param {string} phone 电话号
 * @returns phone number.
 */
const phoneEncryption = (phone:string) => {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

/**
 * 格式化价格数额为字符串
 * 可对小数部分进行填充，默认不填充
 * @param price 价格数额，以分为单位!
 * @param fill 是否填充小数部分 0-不填充 1-填充第一位小数 2-填充两位小数
 */
const priceFormat = function priceFormat(price, fill = 0) {
  if (isNaN(price) || price === null || price === Infinity) {
    return price;
  }
  let priceFormatValue = Math.round(parseFloat(`${price}`) * 10 ** 8) / 10 ** 8; // 恢复精度丢失
  priceFormatValue = `${Math.ceil(priceFormatValue) / 100}`; // 向上取整，单位转换为元，转换为字符串
  if (fill > 0) {
    // 补充小数位数
    if (priceFormatValue.indexOf('.') === -1) {
      priceFormatValue = `${priceFormatValue}.`;
    }
    const n = fill - priceFormatValue.split('.')[1]?.length;
    for (let i = 0; i < n; i++) {
      priceFormatValue = `${priceFormatValue}0`;
    }
  }
  return priceFormatValue;
}
/**
 * 获取节点ClientRect 信息.
 * @param context object 执行上下文.
 * @param selector 选择器节点信息
 * @param needAll boolean 是否全选
 * @returns Rect 
 */
export const getRect = function (context:any, selector:any, needAll:boolean = false) {
  return new Promise((resolve, reject) => {
      context.createSelectorQuery()[needAll ? 'selectAll' : 'select'](selector).boundingClientRect((rect:any) => {
          if (rect) {
              resolve(rect);
          } else {
              reject(rect);
          }
      }).exec();
  });
};

module.exports = {
  formatTime:formatTime,
  formatNumber:formatNumber,
  phoneRegCheck:phoneRegCheck,
  priceFormat:priceFormat,
  phoneEncryption:phoneEncryption,
  getRect:getRect
}
