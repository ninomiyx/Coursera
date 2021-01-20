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
 * @param {Array<number>} data 
 * @param {Array<number>} array 
 */


function countInversions (array) {
  let res = 0;
  function mergeSort (data) {
    if (data.length <= 1) {
      return data;
    }
    let a = data.slice(0, Math.floor(data.length/2));
    let b = data.slice(Math.floor(data.length/2), data.length);
    a = mergeSort(a);
    b = mergeSort(b);
    let counted = [];
    for (let i = 0, j = 0; i < a.length || j < b.length;) {
      if (j === b.length || a[i] <= b[j]) {
        counted.push(a[i]);
        i++;
      } else if (i === a.length || a[i] > b[j]) {
        counted.push(b[j]);
        res += a.length - i;
        j++;
      }
    }
    return counted;
  }
  let counted = mergeSort (array);
  return res;
}

async function main() {
  let array = await readArray('integerArray.txt');
  console.log(countInversions(array));
}

main();




