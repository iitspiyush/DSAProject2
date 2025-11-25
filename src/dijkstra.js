// // Dijkstra’s Algorithm for Airplane Route Optimization
// // -----------------------------------------------------

// export function findShortestPath(graph, start, end) {
//   const distances = {};
//   const visited = {};
//   const previous = {};

//   // Initialize all distances to infinity, except start = 0
//   for (let node in graph) {
//     distances[node] = Infinity;
//     previous[node] = null;
//   }
//   distances[start] = 0;

//   while (true) {
//     // Pick the unvisited node with smallest distance
//     let closestNode = null;
//     for (let node in graph) {
//       if (!visited[node] && (closestNode === null || distances[node] < distances[closestNode])) {
//         closestNode = node;
//       }
//     }

//     if (closestNode === null) break; // all visited or unreachable
//     if (closestNode === end) break;  // reached destination

//     visited[closestNode] = true;

//     // Update distances for neighbors
//     for (let neighbor in graph[closestNode]) {
//       let newDist = distances[closestNode] + graph[closestNode][neighbor];
//       if (newDist < distances[neighbor]) {
//         distances[neighbor] = newDist;
//         previous[neighbor] = closestNode;
//       }
//     }
//   }

//   // Reconstruct shortest path
//   const path = [];
//   let current = end;
//   while (current) {
//     path.unshift(current);
//     current = previous[current];
//   }

//   return { path, distance: distances[end] };
// }
