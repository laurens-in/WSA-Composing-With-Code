type Vertex = {
  id: number;
  data: Object;
};

type Edge = [source: number, destination: number];

type Graph = {
  vertices: Vertex[];
  edges: Edge[];
};

const addVertex = (v: Vertex, g: Graph): Graph => ({
  ...g,
  vertices: [...g.vertices, v],
});

const addEdge = (e: Edge, g: Graph): Graph => {
  e.forEach((vertex) => {
    if (!g.vertices.find((v) => v.id === vertex))
      throw new Error("Edge needs to connect valid vertices");
  });
  return { ...g, edges: [...g.edges, e] };
};

let test: Graph = {
  vertices: [
    { id: 1, data: { pitch: 60 } },
    { id: 2, data: { pitch: 65 } },
  ],
  edges: [[1, 2]],
};

