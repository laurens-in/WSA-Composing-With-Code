// import { visualize } from "./cytoscape";
import { renderTree } from "./draw";
import { nodeCallback } from "./pubsub";
import "./style.css";
import { createLooper, playSequence } from "./synth";
import { Tree, balanceTree, findPaths, insertNode } from "./tree";

const app = document.querySelector<HTMLDivElement>("#app");
const treeDiv = document.querySelector<HTMLDivElement>("#tree");

// const tree: Tree<number> = {
//   data: 60,
//   left: {
//     data: 63,
//     left: {
//       data: 62,
//       left: {
//         data: 58,
//         right: { data: 70 },
//       },
//       right: { data: 56 },
//     },
//     right: {
//       data: 67,
//       left: {
//         data: 72,
//       },
//       right: {
//         data: 61,
//       },
//     },
//   },
//   right: {
//     data: 67,
//     right: {
//       data: 59,
//     },
//   },
// };

let tree: Tree<number> = { data: 60 };

tree = insertNode(tree, 51);
tree = insertNode(tree, 63);
tree = insertNode(tree, 48);
tree = insertNode(tree, 47);
tree = insertNode(tree, 53);
tree = insertNode(tree, 54);
tree = insertNode(tree, 55);
tree = insertNode(tree, 52);
tree = balanceTree(tree);

if (treeDiv) renderTree(tree, treeDiv, nodeCallback);

const paths = findPaths(tree);

paths.forEach((p, i) => {
  const button = document.createElement("button");
  button.addEventListener("click", () => {
    playSequence(p, 0.15, 0.3);
  });
  button.innerHTML = `Branch ${i + 1}`;
  app?.append(button);
});

paths.forEach((p, i) => {
  const button = document.createElement("button");
  button.addEventListener("click", () => {
    playSequence(p.toReversed(), 0.15, 0.3);
  });
  button.innerHTML = `Reverse Branch ${i + 1}`;
  app?.append(button);
});

const [startLoop1, stopLoop1] = createLooper(paths);
const toggle1 = document.createElement("button");
let toggle1State = false;
toggle1.addEventListener("click", () => {
  toggle1State = !toggle1State;
  if (toggle1State) {
    startLoop1();
    toggle1.innerHTML = "Turn Off";
  }
  if (!toggle1State) {
    stopLoop1();
    toggle1.innerHTML = "Turn On";
  }
});
toggle1.innerHTML = "Turn On";

app?.append(toggle1);

const [startLoop2, stopLoop2] = createLooper(paths.map((p) => p.toReversed()));
const toggle2 = document.createElement("button");
let toggle2State = false;
toggle2.addEventListener("click", () => {
  toggle2State = !toggle2State;
  if (toggle2State) {
    startLoop2();
    toggle2.innerHTML = "Turn Off";
  }
  if (!toggle2State) {
    stopLoop2();
    toggle2.innerHTML = "Turn On";
  }
});
toggle2.innerHTML = "Turn On";

app?.append(toggle2);

const allPaths = [...paths, ...paths.map((p) => p.toReversed())];

const [startLoop3, stopLoop3] = createLooper(allPaths);

const toggle3 = document.createElement("button");
let toggle3State = false;
toggle3.addEventListener("click", () => {
  toggle3State = !toggle3State;
  if (toggle3State) {
    startLoop3();
    toggle3.innerHTML = "Turn Off";
  }
  if (!toggle3State) {
    stopLoop3();
    toggle3.innerHTML = "Turn On";
  }
});
toggle3.innerHTML = "Turn On";

app?.append(toggle3);
