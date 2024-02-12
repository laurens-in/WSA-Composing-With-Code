export type Tree<T> = {
  data: T;
  left?: Tree<T>;
  right?: Tree<T>;
};

export const isNode = <T>(t: Tree<T>) => {
  return t.left !== undefined || t.right !== undefined;
};

export const isLeaf = <T>(t: Tree<T>) => {
  return t.left === undefined && t.right === undefined;
};

export const insertNode = <T>(root: Tree<T> | undefined, data: T): Tree<T> => {
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

export function balanceTree<T>(root: Tree<T>): Tree<T> {
  function height(node: Tree<T> | undefined): number {
    if (!node) return 0;
    return 1 + Math.max(height(node.left), height(node.right));
  }

  function balanceFactor(node: Tree<T> | undefined): number {
    if (!node) return 0;
    return height(node.left) - height(node.right);
  }

  function rotateRight(y: Tree<T>): Tree<T> {
    const x = y.left!;
    const temp = x.right;
    x.right = y;
    y.left = temp;
    return x;
  }

  function rotateLeft(x: Tree<T>): Tree<T> {
    const y = x.right!;
    const temp = y.left;
    y.left = x;
    x.right = temp;
    return y;
  }

  function balance(node: Tree<T>): Tree<T> {
    const factor = balanceFactor(node);

    // Left Heavy
    if (factor > 1) {
      if (balanceFactor(node.left) < 0) {
        node.left = rotateLeft(node.left!);
      }
      return rotateRight(node);
    }
    // Right Heavy
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

type IdTree<T> = Tree<T> & { id: string };

const idTree = <T>(tree: Tree<T>, pos = ""): IdTree<T> => {
  if (isLeaf(tree)) {
    return { ...tree, id: pos };
  }

  if (isNode(tree)) {
    const leftPaths = tree.left
      ? idTree(tree.left, pos + "L")
      : { id: pos, data: tree.data };
    const rightPaths = tree.right
      ? idTree(tree.right, pos + "R")
      : { id: pos, data: tree.data };
    return { ...leftPaths, ...rightPaths };
  }
};

function getBorder<T>(root: Tree<T>): T[] {
  const leftBoundary = isNode(root) ? getLeftBoundary(root.left) : [];
  const leaves = getLeaves(root);
  const rightBoundary = isNode(root) ? getRightBoundary(root.right) : [];

  return [root.data, ...leftBoundary, ...leaves, ...rightBoundary];
}

function getLeftBoundary<T>(node: Tree<T> | undefined): T[] {
  if (!node) return [];
  if (isLeaf(node)) return [];

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
  if (isLeaf(node)) return [];

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
  if (isLeaf(node)) return [node.data];

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
    if (isNode(node)) {
      dfs(node.left, node.data);
      dfs(node.right, node.data);
    }
  }

  dfs(root);

  return graph;
}

export const getRandomItem = <T>(items: T[]) =>
  items[Math.floor(Math.random() * items.length)];
