// import { visualize } from "./cytoscape";
import { renderTree } from "./draw";
import "./style.css";
import { Tree, findPaths } from "./tree";

const app = document.querySelector<HTMLDivElement>("#app");
const treeDiv = document.querySelector<HTMLDivElement>("#tree");

const tree: Tree<number> = {
  data: 0,
  left: {
    data: 1,
    left: {
      data: 2,
      left: {
        data: 3,
        right: { data: 10 },
      },
      right: { data: 4 },
    },
    right: {
      data: 5,
      left: {
        data: 7,
      },
      right: {
        data: 6,
      },
    },
  },
  right: {
    data: 7,
    right: {
      data: 8,
    },
  },
};

if (treeDiv) renderTree(tree, treeDiv);

console.log(findPaths(tree));

// let test: Graph = {
//   vertices: [
//     { id: 1, data: { pitch: 60 } },
//     { id: 2, data: { pitch: 65 } },
//   ],
//   edges: [[1, 2]],
// };

// const tree: Tree<number> = {
//   kind: "node",
//   data: 0,
//   left: {
//     kind: "node",
//     data: 1,
//     left: {
//       kind: "node",
//       data: 2,
//       left: {
//         kind: "node",
//         data: 3,
//         right: { kind: "leaf", data: 10 },
//       },
//       right: { kind: "leaf", data: 4 },
//     },
//     right: {
//       kind: "node",
//       data: 5,
//       left: {
//         kind: "leaf",
//         data: 7,
//       },
//       right: {
//         kind: "leaf",
//         data: 6,
//       },
//     },
//   },
//   right: {
//     kind: "node",
//     data: 7,
//     right: {
//       kind: "leaf",
//       data: 8,
//     },
//   },
// };
