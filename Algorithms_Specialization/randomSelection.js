/**
 * 
 * @param {Array<Number>} array 
 * @param {Number} n 
 * @param {Number} ith 
 * @param {Number} l 
 * @param {Number} r 
 */

function Partition (array, l, r) {
  let pivot = array[l];
  let i = l + 1;
  for (let j = l + 1; j <= r; j++) {
    if (array[j] < pivot) {
      let tmp = array[j];
      array[j] = array[i];
      array[i] = tmp;
      i++;
    }
  }
  let tmp = array[l];
  array[l] = array[i-1];
  array[i-1] = tmp;
  return (i-1);
}

function Rselect (array, n, ith) {
  if (n == 1) return array[0];
  let newP = Partition(array, 0, n-1);
  if (newP == ith) return array[newP];
  if (newP > ith) {
    let leftSub = array.slice (0,newP);
    return Rselect (leftSub, leftSub.length, ith);
  }
  if (newP < ith) {
    let rightSub = array.slice (newP+1, array.length);
    return Rselect (rightSub, rightSub.length, ith-newP-1);
  }
}

function randomSelection (array, ith) {
  return Rselect (array, array.length, ith-1);
}

console.log(randomSelection([5,2,8,7,6,4],6))