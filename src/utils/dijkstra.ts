interface Node {
    id: string;
  }
  
  interface Edge {
    id: string;
    source: string;
    target: string;
    weight: number;
  }
  
  export function dijkstra(
    nodes: Node[],
    edges: Edge[],
    startId: string,
    targetId: string
  ): { distance: number; path: string[] } {
    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: string | null } = {};
    const unvisited = new Set(nodes.map((node) => node.id));
  
    nodes.forEach((node) => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
    });
  
    distances[startId] = 0;
  
    while (unvisited.size > 0) {
      const currentId = [...unvisited].reduce((minId, nodeId) =>
        distances[nodeId] < distances[minId] ? nodeId : minId
      );
  
      if (currentId === targetId) {
        const path = [];
        let step: string | null = currentId;
        while (step) {
          path.unshift(step);
          step = previous[step];
        }
        return { distance: distances[currentId], path };
      }
  
      unvisited.delete(currentId);
  
      const currentEdges = edges.filter((edge) => edge.source === currentId);
      currentEdges.forEach((edge) => {
        const alt = distances[currentId] + edge.weight;
        if (alt < distances[edge.target]) {
          distances[edge.target] = alt;
          previous[edge.target] = currentId;
        }
      });
    }
  
    return { distance: Infinity, path: [] };
  }
  