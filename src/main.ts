import "./style.css";
import { renderTree } from "./utils/draw";
import { createLooper, createLooperGraph, playSequence } from "./utils/synth";

const $tree = document.querySelector<HTMLDivElement>("#tree");
const $controls = document.querySelector<HTMLDivElement>("#controls");
