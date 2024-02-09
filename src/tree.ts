type TreeNode<T> =
  | { kind: "node"; left: Tree<T>; right?: Tree<T>; data: T }
  | { kind: "node"; left?: Tree<T>; right: Tree<T>; data: T };

type TreeLeaf<T> = {
  kind: "leaf";
  data: T;
};

export type Tree<T> = TreeNode<T> | TreeLeaf<T>;

export const isNode = <T>(t: Tree<T>): t is TreeNode<T> => {
  return t.kind === "node";
};

export const isLeaf = <T>(t: Tree<T>): t is TreeLeaf<T> => {
  return t.kind === "leaf";
};

const node: TreeNode<number> = {
  kind: "node",
  data: 0,
  left: { kind: "leaf", data: 0 },
  right: { kind: "leaf", data: 0 },
};

const tree: Tree<number> = {
  kind: "node",
  data: 0,
  left: {
    kind: "node",
    data: 1,
    left: {
      kind: "node",
      data: 2,
      left: { kind: "leaf", data: 3 },
      right: { kind: "leaf", data: 4 },
    },
    right: {
      kind: "node",
      data: 5,
      right: {
        kind: "leaf",
        data: 6,
      },
    },
  },
  right: { kind: "node", data: 7, right: { kind: "leaf", data: 8 } },
};

export const findPaths = <T>(node: Tree<T>, path: T[] = []): T[][] => {
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

function getBorder<T>(root: Tree<T>): T[] {
  const leftBoundary = isNode(root) ? getLeftBoundary(root.left) : [];
  const leaves = getLeaves(root);
  const rightBoundary = isNode(root) ? getRightBoundary(root.right) : [];

  return [root.data, ...leftBoundary, ...leaves, ...rightBoundary];
}

function getLeftBoundary<T>(node: Tree<T> | undefined): T[] {
  if (!node) return [];
  if (node.kind === "leaf") return [];

  const leftBoundary = [node.data];
  if (node.left) {
    leftBoundary.push(...getLeftBoundary(node.left));
  } else if (node.right) {
    leftBoundary.push(...getLeftBoundary(node.right));
  }

  return leftBoundary;
}

function getRightBoundary<T>(node: Tree<T> | undefined): T[] {
  if (!node) return [];
  if (node.kind === "leaf") return [];

  const rightBoundary = [node.data];
  if (node.right) {
    rightBoundary.push(...getRightBoundary(node.right));
  } else if (node.left) {
    rightBoundary.push(...getRightBoundary(node.left));
  }

  return rightBoundary.reverse();
}

function getLeaves<T>(node: Tree<T> | undefined): T[] {
  if (!node) return [];
  if (node.kind === "leaf") return [node.data];

  return [...getLeaves(node.left), ...getLeaves(node.right)];
}

type UndirectedGraph<T> = Map<T, T[]>;

function treeToUndirectedGraph<T>(root: Tree<T>): UndirectedGraph<T> {
  const graph: UndirectedGraph<T> = new Map();

  function addEdge(from: T, to: T) {
    if (!graph.has(from)) {
      graph.set(from, []);
    }
    graph.get(from)?.push(to);
  }

  function dfs(node: Tree<T> | undefined, parent: T | undefined = undefined) {
    if (!node) return;
    if (parent !== undefined) {
      addEdge(parent, node.data); // Edge from parent to child
      addEdge(node.data, parent); // Edge from child to parent (undirected)
    }
    if (node.kind === "node") {
      dfs(node.left, node.data);
      dfs(node.right, node.data);
    }
  }

  dfs(root);

  return graph;
}

export const getRandomItem = <T>(items: T[]) =>
  items[Math.floor(Math.random() * items.length)];
