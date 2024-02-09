import cytoscape, {
  ElementDefinition,
  ElementsDefinition,
  NodeDataDefinition,
  NodeSingular,
} from "cytoscape";
import { Tree, isLeaf, isNode } from "./tree";

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
      left: {
        kind: "node",
        data: 7,
        left: {
          kind: "node",
          data: 8,
          left: { kind: "leaf", data: 10 },
          right: { kind: "leaf", data: 11 },
        },
        right: {
          kind: "node",
          data: 8,
          left: { kind: "leaf", data: 12 },
          right: { kind: "leaf", data: 13 },
        },
      },
      right: {
        kind: "leaf",
        data: 6,
      },
    },
  },
  right: { kind: "node", data: 7, right: { kind: "leaf", data: 8 } },
};

const transformTree = <T>(
  tree: Tree<T>,
  graph: cytoscape.NodeDataDefinition[] = []
): NodeDataDefinition[] => {
  if (isLeaf(tree)) {
    return [...graph, { data: tree.data }];
  }

  if (isNode(tree)) {
    const leftElements = tree.left
      ? transformTree(tree.left, [
          ...graph,
          { data: tree.data },
          {
            id: `${tree.data}-${tree.left.data}`,
            source: tree.data,
            target: tree.left.data,
          },
        ])
      : [];
    const rightElements = tree.right
      ? transformTree(tree.right, [
          ...graph,
          { id: (tree.data as number).toString(), data: tree.data },
          {
            id: `${tree.data}-${tree.right.data}`,
            source: tree.data,
            target: tree.right.data,
          },
        ])
      : [];
    return [...leftElements, ...rightElements];
  }

  return [];
};

export const draw = <T>(tree: Tree<T>, container: HTMLDivElement) => {
  cytoscape({
    container: container, // container to render in
    elements: transformTree(tree) as ElementDefinition[],
    style: [
      {
        selector: "node",
        style: {
          "background-color": "#666",
        },
      },
      {
        selector: "edge",
        style: {
          width: 3,
          "line-color": "#ccc",
          "target-arrow-color": "#ccc",
          "target-arrow-shape": "triangle",
          "curve-style": "bezier",
        },
      },
    ],
    layout: {
      name: "breadthfirst",
    },
  }).on("tap", "node", (evt) => {
    const node = evt.target as NodeSingular;
    console.log("tapped ", node.data());
    node
      .animate(
        {
          style: { backgroundColor: "red" },
        },
        {
          duration: 100,
        }
      )
      .animate(
        {
          style: { backgroundColor: "#666" },
        },
        {
          duration: 500,
        }
      );
  });
};
