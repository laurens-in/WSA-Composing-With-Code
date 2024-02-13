import "./style.css";
import { renderTree } from "./utils/draw";
import { createLooper, playSequence } from "./utils/synth";
import { Tree, findPaths, treeFromArray } from "./tree";

const controls = document.querySelector<HTMLDivElement>("#controls");
const treeDiv = document.querySelector<HTMLDivElement>("#tree");

// 1.0 create any tree as a literal
let tree: Tree = {
  data: 60,
  left: {
    data: 63,
    left: {
      data: 62,
      left: {
        data: 58,
        right: { data: 70 },
      },
      right: { data: 56 },
    },
    right: {
      data: 69,
      left: {
        data: 72,
      },
      right: {
        data: 61,
      },
    },
  },
  right: {
    data: 67,
    right: {
      data: 59,
    },
  },
};

// 1.5 create a binary search tree from an array!
tree = treeFromArray([
  60, 62, 63, 65, 67, 68, 70, 72, 74, 75, 77, 79, 80, 82, 84,
]);

// 1.1 render the tree
if (treeDiv) renderTree(tree, treeDiv);

// 1.2 find all paths through the tree
const paths = findPaths(tree);

// 1.3 create a button to play each path
paths.forEach((p, i) => {
  const button = document.createElement("button");
  button.addEventListener("click", () => {
    playSequence(p, 0.15, 0.3);
  });
  button.innerHTML = `Branch ${i + 1}`;
  controls?.append(button);
});

// 1.4 create a button to play each path reversed
paths.forEach((p, i) => {
  const button = document.createElement("button");
  button.addEventListener("click", () => {
    playSequence(p.toReversed(), 0.15, 0.3);
  });
  button.innerHTML = `Reverse Branch ${i + 1}`;
  controls?.append(button);
});

// 1.6 create a button to loop through the top-down paths
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

controls?.append(toggle1);

// 1.7 create a button to loop through the bottom-up paths
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

controls?.append(toggle2);

// 1.8 create a button to loop through all paths
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

controls?.append(toggle3);
