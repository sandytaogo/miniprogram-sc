let addressPromise:any = [];

/** 获取一个地址选择Promise */
export const getAddressPromise = () => {
  let resolver;
  let rejecter;
  const nextPromise = new Promise((resolve, reject) => {
    resolver = resolve;
    rejecter = reject;
  });
  addressPromise.push({ resolver, rejecter });
  return nextPromise;
};

/** 用户选择了一个地址 */
export const resolveAddress = (address:any) => {
  const allAddress = [...addressPromise];
  addressPromise = [];
  allAddress.forEach(({ resolver }) => resolver(address));
};

/** 用户没有选择任何地址只是返回上一页了 */
export const rejectAddress = (params:any) => {
  if (params != null) {
  }
  const allAddress = [...addressPromise];
  addressPromise = [];
  allAddress.forEach(({ rejecter }) => rejecter(new Error('cancel')));
};
