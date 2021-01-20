/**
 * 
 * @param {Array<number>} x 
 * @param {Array<number>} y 
 */
function integerMultiple (num1, num2) {
  x = num1.split("").map(i => parseInt(i, 10));
  y = num2.split("").map(i => parseInt(i, 10));
  let res = [];
  for (let i = 0; i < (x.length + y.length); i++) {
    res.push(0);
  }
  for (let i = x.length - 1; i >= 0; i--) {
    for (let j = y.length - 1; j >= 0; j--) {
      res[i + j + 1] = x[i] * y[j] + res[i + j + 1];
      if (res[i + j + 1] >= 10) {
        res[i + j] += Math.floor(res[i + j + 1] / 10);
        res[i + j + 1] = res[i + j + 1] % 10;
      }
    }
  }
  while (res[0] == 0) {
    res.shift();
  }
  return res.join("");
}
console.log(integerMultiple("3141592653589793238462643383279502884197169399375105820974944592", "2718281828459045235360287471352662497757247093699959574966967627"));