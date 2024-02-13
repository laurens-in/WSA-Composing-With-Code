export type Note = number;

export type Tree = {
  data: number;
  left?: Tree;
  right?: Tree;
};

export const isNode = (t: Tree) => {
  return t.left !== undefined || t.right !== undefined;
};

export const isLeaf = (t: Tree) => {
  return t.left === undefined && t.right === undefined;
};

export const insertNode = (root: Tree | undefined, data: number): Tree => {
  if (!root) {
    return { data, left: undefined, right: undefined };
  }

  if (data < root.data) {
    root.left = insertNode(root.left, data);
  } else if (data > root.data) {
    root.right = insertNode(root.right, data);
  }

  return root;
};

export const treeFromArray = (ns: number[]): Tree => {
  const sorted = ns.toSorted((a, b) => (a > b ? 1 : -1));
  console.log(sorted);
  return rTreeFromArray(sorted) as Tree;
};

const rTreeFromArray = (ns: number[]): Tree | undefined => {
  console.log(ns);
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

export function balanceTree(root: Tree): Tree {
  function height(node: Tree | undefined): number {
    if (!node) return 0;
    return 1 + Math.max(height(node.left), height(node.right));
  }

  function balanceFactor(node: Tree | undefined): number {
    if (!node) return 0;
    return height(node.left) - height(node.right);
  }

  function rotateRight(y: Tree): Tree {
    const x = y.left!;
    const temp = x.right;
    x.right = y;
    y.left = temp;
    return x;
  }

  function rotateLeft(x: Tree): Tree {
    const y = x.right!;
    const temp = y.left;
    y.left = x;
    x.right = temp;
    return y;
  }

  function balance(node: Tree): Tree {
    const factor = balanceFactor(node);

    // left heavy
    if (factor > 1) {
      if (balanceFactor(node.left) < 0) {
        node.left = rotateLeft(node.left!);
      }
      return rotateRight(node);
    }
    // right heavy
    if (factor < -1) {
      if (balanceFactor(node.right) > 0) {
        node.right = rotateRight(node.right!);
      }
      return rotateLeft(node);
    }
    return node;
  }

  return balance(root);
}

export const findPaths = (node: Tree, path: T[] = []): T[][] => {
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

export const getBorder = (root: Tree): T[] => {
  const leftBoundary = isNode(root) ? getLeftBoundary(root.left) : [];
  const leaves = getLeaves(root);
  const rightBoundary = isNode(root) ? getRightBoundary(root.right) : [];

  return [root.data, ...leftBoundary, ...leaves, ...rightBoundary];
};

const getLeftBoundary = (node: Tree | undefined): number[] => {
  if (!node || isLeaf(node)) return [];

  const leftBoundary = [node.data];
  const nextNode = node.left || node.right;
  return [...leftBoundary, ...getLeftBoundary(nextNode)];
};

const getRightBoundary = (node: Tree | undefined): number[] => {
  if (!node || isLeaf(node)) return [];

  const rightBoundary = [node.data];
  const nextNode = node.right || node.left;
  return [...rightBoundary, ...getRightBoundary(nextNode)].reverse();
};

const getLeaves = (node: Tree | undefined): number[] => {
  if (!node) return [];
  if (isLeaf(node)) return [node.data];

  return [...getLeaves(node.left), ...getLeaves(node.right)];
};

// convert tree to undirected graph
type UndirectedGraph = Map<number, number[]>;

export const treeToUndirectedGraph = (root: Tree): UndirectedGraph => {
  const graph: UndirectedGraph = new Map();

  const addEdge = (from: number, to: number) => {
    if (!graph.has(from)) {
      graph.set(from, []);
    }
    graph.get(from)?.push(to);
  };

  const dfs = (
    node: Tree | undefined,
    parent: number | undefined = undefined
  ) => {
    if (!node) return;
    if (parent !== undefined) {
      addEdge(parent, node.data); // Edge from parent to child
      addEdge(node.data, parent); // Edge from child to parent (undirected)
    }
    if (isNode(node)) {
      dfs(node.left, node.data);
      dfs(node.right, node.data);
    }
  };

  dfs(root);

  return graph;
};
