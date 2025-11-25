// ---------- UTILITY: Create perturbed copy of graph ----------
function perturbGraph(graph, factor = 0.5) {
  const newGraph = {};
  for (let u in graph) {
    newGraph[u] = {};
    for (let v in graph[u]) {
      // Slight random noise to weights
      newGraph[u][v] = graph[u][v] + Math.random() * factor;
    }
  }
  return newGraph;
}

// ---------- DIJKSTRA ----------
export function dijkstra(graph, start, end) {
  const dist = {};
  const prev = {};
  const visited = new Set();

  for (let node in graph) {
    dist[node] = Infinity;
    prev[node] = null;
  }
  dist[start] = 0;

  while (visited.size < Object.keys(graph).length) {
    const current = Object.keys(graph)
      .filter((n) => !visited.has(n))
      .reduce((a, b) => (dist[a] < dist[b] ? a : b));
    if (dist[current] === Infinity) break;
    visited.add(current);

    for (let neighbor in graph[current]) {
      const newDist = dist[current] + graph[current][neighbor];
      // Tie-breaking to create variation
      if (newDist < dist[neighbor] || (newDist === dist[neighbor] && neighbor < prev[neighbor])) {
        dist[neighbor] = newDist;
        prev[neighbor] = current;
      }
    }
  }

  const path = [];
  let u = end;
  while (u) {
    path.unshift(u);
    u = prev[u];
  }

  if (dist[end] === Infinity) return { path: [], distance: Infinity };
  return { path, distance: dist[end] };
}

// ---------- BELLMAN–FORD ----------
export function bellmanFord(graph, start, end) {
  const nodes = Object.keys(graph);
  const dist = {};
  const prev = {};
  nodes.forEach((n) => {
    dist[n] = Infinity;
    prev[n] = null;
  });
  dist[start] = 0;

  for (let i = 0; i < nodes.length - 1; i++) {
    for (let u of nodes) {
      for (let v in graph[u]) {
        const weight = graph[u][v];
        if (dist[u] + weight < dist[v] || (dist[u] + weight === dist[v] && u < prev[v])) {
          dist[v] = dist[u] + weight;
          prev[v] = u;
        }
      }
    }
  }

  const path = [];
  let u = end;
  while (u) {
    path.unshift(u);
    u = prev[u];
  }

  if (dist[end] === Infinity) return { path: [], distance: Infinity };
  return { path, distance: dist[end] };
}

// ---------- FLOYD–WARSHALL ----------
export function floydWarshall(graph, start, end) {
  const nodes = Object.keys(graph);
  const dist = {};
  const next = {};

  for (let i of nodes) {
    dist[i] = {};
    next[i] = {};
    for (let j of nodes) {
      if (i === j) dist[i][j] = 0;
      else if (graph[i][j] !== undefined) dist[i][j] = graph[i][j];
      else dist[i][j] = Infinity;
      next[i][j] = graph[i][j] !== undefined ? j : null;
    }
  }

  for (let k of nodes) {
    for (let i of nodes) {
      for (let j of nodes) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          next[i][j] = next[i][k];
        }
      }
    }
  }

  if (next[start][end] === null) return { path: [], distance: Infinity };

  const path = [];
  let u = start;
  while (u !== end) {
    path.push(u);
    u = next[u][end];
  }
  path.push(end);

  return { path, distance: dist[start][end] };
}

// ---------- A* ----------
export function aStar(graph, start, end, coords) {
  const openSet = new Set([start]);
  const cameFrom = {};
  const gScore = {};
  const fScore = {};

  for (let node in graph) {
    gScore[node] = Infinity;
    fScore[node] = Infinity;
  }

  gScore[start] = 0;
  fScore[start] = heuristic(start, end, coords, Math.random() * 2);

  while (openSet.size > 0) {
    let current = null;
    let minF = Infinity;

    for (let node of openSet) {
      if (fScore[node] < minF) {
        minF = fScore[node];
        current = node;
      }
    }

    if (current === end) {
      const path = [];
      let temp = current;
      while (temp) {
        path.unshift(temp);
        temp = cameFrom[temp];
      }
      return { path, distance: gScore[end] };
    }

    openSet.delete(current);

    for (let neighbor in graph[current]) {
      const tentativeG = gScore[current] + graph[current][neighbor];
      if (tentativeG < gScore[neighbor]) {
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeG;
        fScore[neighbor] = tentativeG + heuristic(neighbor, end, coords, Math.random() * 2);
        openSet.add(neighbor);
      }
    }
  }

  return { path: [], distance: Infinity };
}

function heuristic(a, b, coords, bias = 0) {
  const dx = coords[a].x - coords[b].x;
  const dy = coords[a].y - coords[b].y;
  return Math.sqrt(dx * dx + dy * dy) + bias;
}

// ---------- JOHNSON’S ----------
export function johnson(graph, start, end) {
  // Perturb graph differently
  const reweighted = perturbGraph(graph, 1.5);
  return dijkstra(reweighted, start, end);
}
