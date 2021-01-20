const fs = require('fs');
const readline = require('readline');
// use readline because the file is too large, needs to read line by line, instead of reading the whole file at one time. Save memory.

const INPUT_FILE = 'countSCC.txt';

async function readGraph() {
  const fileStream = fs.createReadStream(INPUT_FILE, {
    encoding: 'utf8',
  });
  const readlineInterface = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity

  });
  const arcs = [];
  let maxNodeId = 0;
  await new Promise((resolve) => {
    readlineInterface.on('line', line => {
      line = line.trim();
      if(!line) return;
      const arc = line.split(' ').map(x => parseInt(x, 10));
      arcs.push(arc);
      maxNodeId = Math.max(arc[0], arc[1], maxNodeId);
    });
    readlineInterface.on('close', resolve);
  })

  const G = new Array(maxNodeId + 1);
  const revG = new Array(maxNodeId + 1);
  for (let i = 0; i <= maxNodeId; i++) {
    G[i] = {
      next: [],
      visited: false,
    };
    revG[i] = {
      next: [],
      visited: false,
    };
  }
  for (const [from, to] of arcs) {
    G[from].next.push(to);
    revG[to].next.push(from);
  }
  return {G, revG};
}

// compute the finish time
function dfsLoop1(g) {
  let t = 0;
  let finish = new Array(g.length);
  function dfs(node) {
    g[node].visited = true;
    for (const next of g[node].next) {
      if (g[next].visited) continue;
      dfs(next);
    }
    t++;
    finish[t] = node;
  }
  for (let i = g.length - 1; i >= 1; i--) {
    if (g[i].visited) continue;
    dfs(i)
  }
  return finish;
}

function dfsLoop2(g, finish) {
  let s = null;
  let leader = new Array(g.length);

  function dfs(node) {
    g[node].visited = true;
    leader[node] = s;
    for (const next of g[node].next) {
      if (g[next].visited) continue;
      dfs(next);
    }
  }

  for (let i = finish.length - 1; i >= 1; i--) {
    const node = finish[i];
    if (g[node].visited) continue;
    s = node;
    dfs(node);
  }
  
  const leader2count = leader.reduce((acc, v) => {
    if (!acc[v]) {
      acc[v] = 0;
    }
    acc[v]++;
    return acc;
  }, {});

  return Object.keys(leader2count)
    .sort((a, b) =>
      leader2count[b] - leader2count[a]
    )
    .slice(0, 5)
    .map(leader => leader2count[leader])
    .join(",");
}


async function main() {
  const {G, revG} = await readGraph();
  const finish = dfsLoop1(revG);
  const result = dfsLoop2(G, finish);
  console.log(result);
}

main();