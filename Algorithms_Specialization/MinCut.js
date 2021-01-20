const fs = require('fs');

async function readFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, {
      encoding: 'utf8'
    }, (err, data) => {
      if(err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

async function readArray(filename) {
  const graph = {};
  const input = await readFile(filename);
  const lines = input.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.length === 0) continue;
    const columns = line.split('\t');
    const currentNodeId = parseInt(columns[0], 10);
    const nextNodes = columns.slice(1)
      .map(x => x.trim())
      .filter(c => c)
      .map(c => parseInt(c, 10));
    graph[currentNodeId] = nextNodes;
  }
  return graph;
}

// pick a remaining edge at random
function pickEdge (graph) {
  let keys = Object.keys(graph);
  let a = keys[Math.floor(Math.random() * keys.length)];
  let b = graph[a][Math.floor(Math.random() * graph[a].length)];
  let edgePicked = [a,b];
  return edgePicked;
}

function mergeEdge (edgePicked, graph) {
  let a = edgePicked[0];
  let b = edgePicked[1];
  Array.prototype.push.apply(graph[a],graph[b]);
  for (let i = 0; i < graph[b].length; i++) {
    for (let j = 0; j < graph[graph[b][i]].length; j++) {
      if (graph[graph[b][i]][j] == b) {
        graph[graph[b][i]][j] = a;
      }
    }
  }
  graph[a] = graph[a].filter(item => item != a);
  delete graph[b];
  return graph;
}


function MinCut (graph) {
  while (Object.keys(graph).length > 2) {
    let edgePicked = pickEdge(graph);
    graph = mergeEdge (edgePicked, graph);
  }
  let cut = graph[Object.keys(graph)[0]].length;
  return cut;
}


async function main() {
  let min_Cut = 1000;
  for (let i = 0; i < 2; i++) {
    let graph = await readArray('MinCut.txt');
    let cut = MinCut(graph);
    cut = MinCut(graph);
    if (cut < min_Cut) {
      min_Cut = cut;
    }
  }
  console.log(min_Cut);
  return min_Cut;
}

main ();