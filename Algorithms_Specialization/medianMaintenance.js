const fs = require('fs');
const INPUT_FILE = 'MedianMaintain.txt';
const MAX_NODE = 10000;

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

// Implement the "Median Maintenance" algorithm through heaps
// A Min-Heap and A Max-Heap

// Run heapify the last node 
function maxHeapifyLast(array, n) {
  for (let i = n; i > 0;) {
    let parent = Math.floor((i-1)/2);
    if (array[i] > array[parent]) {
      let tmp = array[i];
      array[i] = array[parent];
      array[parent] = tmp;
    } else {
      break;
    }
    i = parent;
  }
  return array;
}

function minHeapifyLast(array, n) {
  for (let i = n; i > 0;) {
    let parent = Math.floor((i-1)/2);
    if (array[i] < array[parent]) {
      let tmp = array[i];
      array[i] = array[parent];
      array[parent] = tmp;
    } else {
      break;
    }
    i = parent;
  }
  return array;
}

//Run heapify from the first node
function maxHeapifyFirst(array) {
  for (let i = 0; i < Math.floor(array.length/2);) {
    let l = i * 2 + 1;
    let r = l + 1;
    let largest = i;
    if (l < array.length && array[l] > array[largest]) {
      largest = l;
    }
    if (r < array.length && array[r] > array[largest]) {
      largest = r;
    }
    if (largest != i) {
      let tmp = array[i];
      array[i] = array[largest];
      array[largest] = tmp;
    } else {
      break;
    }
    i = largest;
  }
  return array;
}

function minHeapifyFirst(array) {
  for (let i = 0; i < Math.floor(array.length/2);) {
    let l = i * 2 + 1;
    let r = l + 1;
    let smallest = i;
    if (l < array.length && array[l] < array[smallest]) {
      smallest = l;
    }
    if (r < array.length && array[r] < array[smallest]) {
      smallest = r;
    }
    if (smallest != i) {
      let tmp = array[i];
      array[i] = array[smallest];
      array[smallest] = tmp;
    } else {
      break;
    }
    i = smallest;
  }
  return array;
}

function extractTop(array, type) {
  array[0] = array[array.length - 1];
  array.pop();
  if (type === "Max") {
    array = maxHeapifyFirst(array);
  }
  if (type === "Min") {
    array = minHeapifyFirst(array);
  }
  return array;
}

function reBalance(minSub, maxSub) {
  if (minSub.length > maxSub.length) {
    maxSub.push(minSub[0]);
    minSub = extractTop(minSub, "Max");
    maxSub = minHeapifyLast(maxSub, maxSub.length - 1);
  } else {
    minSub.push(maxSub[0]);
    maxSub = extractTop(maxSub, "Min");
    minSub = maxHeapifyLast(minSub, minSub.length - 1);
  }
  return [minSub, maxSub];
}

function median (array) {
  let length = array.length;
  let minSub = [];
  let maxSub = [];
  let med = [array[0]];
  let res = array[0];
  if (array[0] < array[1]) {
    minSub.push(array[0]);
    maxSub.push(array[1]);
  } else {
    minSub.push(array[1]);
    maxSub.push(array[0]);
  }
  med.push(minSub[0]);
  res += med[1];
  for (let i = 2; i < length; i++) {
    if (array[i] < minSub[0]) {
      minSub.push(array[i]);
      minSub = maxHeapifyLast(minSub, minSub.length - 1);
    } else {
      maxSub.push(array[i]);
      maxSub = minHeapifyLast(maxSub, maxSub.length - 1);
    }
    if (Math.abs(minSub.length - maxSub.length) > 1) {
      //Re-balance two heaps
      [minSub, maxSub] = reBalance(minSub, maxSub);
    } 
    if (minSub.length >= maxSub.length) {
      med.push(minSub[0]);
    } else {
      med.push(maxSub[0]);
    }
    res += med[med.length - 1];
  }
  //console.log(med.join(", "));
  return res;
}

async function main() {
  let array = await readArray(INPUT_FILE);
  let res = median(array);
  console.log(res);
  return;
}

main();