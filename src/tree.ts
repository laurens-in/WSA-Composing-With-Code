// 1.0 declare note type

// could be anything
// type Note = "A" | "B" | "C" | "D";
export type Note = number;

// 1.1 declare tree type
export type Tree = {
  data: Note;
  left?: Tree;
  right?: Tree;
};

// 1.2 declare helpers isNode & isLeaf
export const isNode = (t: Tree) => {
  return t.left !== undefined || t.right !== undefined;
};

export const isLeaf = (t: Tree) => {
  return t.left === undefined && t.right === undefined;
};

// 1.3 implement findPaths
export const findPaths = (node: Tree, path: Note[] = []): Note[][] => {
  if (!node) return [];

  if (isLeaf(node)) {
    return [[...path, node.data]];
  }

  if (isNode(node)) {
    const leftPaths = node.left
      ? findPaths(node.left, [...path, node.data])
      : [];
    const rightPaths = node.right
      ? findPaths(node.right, [...path, node.data])
      : [];
    return [...leftPaths, ...rightPaths];
  }
  return [];
};

// 1.4 implement treeFromArray
export const treeFromArray = (
  ns: Note[],
  comp = (a: Note, b: Note) => (a > b ? 1 : -1)
): Tree => {
  const sorted = ns.toSorted(comp);
  return rTreeFromArray(sorted) as Tree;
};

const rTreeFromArray = (ns: Note[]): Tree | undefined => {
  if (ns.length === 0) {
    return undefined;
  }
  const middleIndex = Math.floor(ns.length / 2);
  const node: Tree = {
    data: ns[middleIndex],
  };

  const leftSubtree = ns.slice(0, middleIndex);
  const rightSubtree = ns.slice(middleIndex + 1);

  node.left = rTreeFromArray(leftSubtree);
  node.right = rTreeFromArray(rightSubtree);

  return node;
};

// 1.5 convert tree to undirected graph
type UndirectedGraph = Record<Note, Note[]>;

export const treeToGraph = (root: Tree): UndirectedGraph => {
  const graph: UndirectedGraph = {};

  const addEdge = (from: Note, to: Note) => {
    graph[from] = [...(graph[from] || []), to];
  };

  const findEdges = (
    node: Tree | undefined,
    parent: Note | undefined = undefined
  ) => {
    if (!node) return;
    if (parent !== undefined) {
      addEdge(parent, node.data); // Edge from parent to child
      addEdge(node.data, parent); // Edge from child to parent (undirected)
    }
    if (isNode(node)) {
      findEdges(node.left, node.data);
      findEdges(node.right, node.data);
    }
  };

  findEdges(root);

  return graph;
};
