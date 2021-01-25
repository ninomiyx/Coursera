const fs = require('fs');

async function readText(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, {
      encoding: 'utf8'
    }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

async function readArray(filename) {
  const text = await readText(filename);
  return text.split('\n')
    .filter(line => line)
    .map(line => parseInt(line, 10));
}

/**
 * 
 * @param {Array<number>} array 
 * @param {Number} a
 * @param {Number} b
 * @param {Number} l
 * @param {Number} r
 * @param {Number} comparisons
 */
let comparisons = 0;

// use 1st element as pivot
function Partition (array, l, r) {
  let pivot = array[l];
  let i = l + 1;
  for (let j = l + 1; j <= r; j++) {
    comparisons += 1;
    if (array[j] < pivot) {
      let tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
      i++;
    }
  }
  let tmp = array[l];
  array[l] = array[i-1];
  array[i-1] = tmp;
  return (i-1);
}

//use the last element as pivot
function Partition (array, l, r) {
  // the only difference is here:
  // swap the last element with the first one
  let pivot = array[r];
  array[r] = array[l];
  array[l] = pivot;
  let i = l + 1;
  for (let j = l + 1; j <= r; j++) {
    comparisons += 1;
    if (array[j] < pivot) {
      let tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
      i++;
    }
  }
  let tmp = array[l];
  array[l] = array[i-1];
  array[i-1] = tmp;
  return (i-1);
}

//use the middle element as pivot
function Partition (array, l, r) {
  let middle = l + Math.floor((r-l)/2);
  // compare array[l], array[middle], and array[r]
  // the pivot will be the midian of these three numbers
  if (array[l] > array[r]) {
    if (array[middle] > array[r]) {
      middle = array[l] > array[middle] ? middle : l;
    } else {
      middle = r;
    }
  } else {
    if (array[middle] < array[r]) {
      middle = array[middle] > array[l] ? middle : l;
    } else {
      middle = r;
    }
  }
  let pivot = array[middle];
  array[middle] = array[l];
  array[l] = pivot;
  let i = l + 1;
  for (let j = l + 1; j <= r; j++) {
    comparisons += 1;
    if (array[j] < pivot) {
      let tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
      i++;
    }
  }
  let tmp = array[l];
  array[l] = array[i-1];
  array[i-1] = tmp;
  return (i-1);
}


function quickSort (array, l, r) {
  if (r-l < 1) return array;
  let pivot = Partition (array, l ,r);  
  quickSort(array, l, pivot - 1);
  quickSort(array, pivot + 1, r);
  return array;
}

function countComparison (array) {
  quickSort (array, 0, array.length - 1);
  return comparisons;
}

async function main() {
  let array = await readArray('quickSort.txt');
  console.log(countComparison(array));
}

main();