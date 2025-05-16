
/**
 * 延迟执行函数.
 * @param ms 延迟执行时间 单位毫秒.
 */
export function delay(ms = 200) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
