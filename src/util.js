export const addCommaToPrice = (price) => {
  const priceStr = price.toString();
  let ret = "",
    strCnt = 0;
  for (let i = priceStr.length - 1; i >= 0; i--) {
    strCnt += 1;
    ret = `${priceStr[i]}${strCnt > 3 && strCnt % 3 === 1 ? "," : ""}${ret}`;
  }
  return ret;
};
