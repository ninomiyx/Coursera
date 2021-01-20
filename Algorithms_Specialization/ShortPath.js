const fs = require('fs');
const INPUT_FILE = 'ShortPath.txt';
const MAX_NODE = 200;

async function readGraph(filename) {
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
  const input = await readGraph(filename);
  const lines = input.split('\n');
  const graph = new Array(MAX_NODE + 1);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.length === 0) continue;
    const toVertex = line.split('\t');
    const node = parseInt(toVertex[0], 10);
    graph[node] = toVertex.slice(1)
      .map(x => x.split(',').map(y => parseInt(y, 10)))
  }
  return graph;
}

function dijkstra(graph) {
  const visited = new Array(MAX_NODE + 1).fill(false);
  const distance = new Array(MAX_NODE + 1).fill(100000);
  distance[1] = 0;
  let previous = 1;
  for (let i = 1; i <= MAX_NODE; i++) {
    visited[previous] = true;
    for (let [toVertex, dis] of graph[previous]) {
      // if toVertex is not in visited
      if (visited.indexOf(toVertex) == -1) {
        if (distance[toVertex] > dis + distance[previous]) {
          distance[toVertex] = dis + distance[previous]
        }
      }
    }
    //add the vertex with the smallest distance into visited array
    let next = -1;
    let nextDis = -1;
    for (let j = 1; j <= MAX_NODE; j++) {
      // if j is visited, then end this cycle and go into the next cycle
      if (visited[j]) continue;
      if (next === -1 || nextDis > distance[j]) {
        next = j;
        nextDis = distance[j];
      }
    }
    previous = next;
  }
  return distance;
}

async function main() {
  let graph = await readArray(INPUT_FILE);
  let res = dijkstra(graph);
  return res;
}

main ();