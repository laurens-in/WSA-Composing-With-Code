import { playNote } from "./synth";
import { Tree, findPaths, isLeaf, isNode } from "../tree";
import { nodeCallback } from "./pubsub";

export const renderTree = <T>(t: Tree<T>, container: HTMLDivElement) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  const obs = new ResizeObserver(() => {
    drawTree(t, svg, container, nodeCallback);
  });
  drawTree(t, svg, container, nodeCallback);
  obs.observe(container);
};

const drawTree = <T>(
  t: Tree<T>,
  svg: SVGSVGElement,
  container: HTMLDivElement,
  nodeCallback: (nodeId: string, g: SVGElement) => void
) => {
  svg.innerHTML = "";
  const ratio = container.clientHeight / container.clientWidth;

  const width = 100;
  const height = 100 * ratio;

  svg.setAttribute("viewBox", `0 0 120 ${120 * ratio}`);
  svg.setAttribute("preserveAspectRatio", "none");

  svg.width.baseVal.valueAsString = `${container.clientWidth}px`;
  svg.height.baseVal.valueAsString = `${container.clientHeight}px`;

  container.append(svg);

  const paddingH = 10;
  const paddingV = height * 0.1;
  const depth = findPaths(t).reduce((p, c) => (p > c.length ? p : c.length), 0);
  const breadth = Math.pow(2, depth - 1);

  const spaces = breadth * 2 - 1;
  const radius = Math.min((100 / spaces) * 0.8, height * 0.1);
  const indents = [
    0,
    ...[...Array(depth - 1).keys()].map((v) => Math.pow(2, v)).reverse(),
  ];

  recursiveDraw(
    t,
    svg,
    { x: width / 2 + paddingH, y: paddingV },
    radius,
    {
      h: 100 / spaces,
      v: height / (depth - 1),
    },
    indents,
    nodeCallback,
    0
  );
};

const recursiveDraw = <T>(
  node: Tree<T>,
  svg: SVGSVGElement,
  position: { x: number; y: number },
  radius: number,
  space: { h: number; v: number },
  indents: number[],
  nodeCallback: (nodeId: string, g: SVGElement) => void,
  depth = 0
) => {
  if (isNode(node)) {
    if (node.left) {
      const nextLeftPosition = {
        x: position.x - indents[depth + 1] * space.h,
        y: position.y + space.v,
      };
      drawLine(position, nextLeftPosition, radius, svg);
      recursiveDraw(
        node.left,
        svg,
        nextLeftPosition,
        radius,
        space,
        indents,
        nodeCallback,
        depth + 1
      );
    }
    if (node.right) {
      const nextRightPosition = {
        x: position.x + indents[depth + 1] * space.h,
        y: position.y + space.v,
      };
      drawLine(position, nextRightPosition, radius, svg);
      recursiveDraw(
        node.right,
        svg,
        nextRightPosition,
        radius,
        space,
        indents,
        nodeCallback,
        depth + 1
      );
    }
  }

  const circle = createCircle(
    position.x,
    position.y,
    radius,
    (node.data as number).toString(),
    node.data as number,
    nodeCallback
  );

  svg.append(circle);

  if (isLeaf(node)) return;
};

const createCircle = (
  x: number,
  y: number,
  r: number,
  label: string,
  data: number,
  nodeCallback: (nodeId: string, g: SVGElement) => void
) => {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.addEventListener("click", () => {
    playNote(data);
  });

  nodeCallback(label, group);

  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  circle.cx.baseVal.value = x;
  circle.cy.baseVal.value = y;
  circle.r.baseVal.value = r * 0.9;
  circle.style.strokeWidth = `${r * 0.2}`;
  circle.style.fill = "currentColor";

  group.append(circle);
  const text = getText(x, y, r * 1.5, label);
  group.append(text);
  return group;
};

const drawLine = (
  origin: { x: number; y: number },
  target: { x: number; y: number },
  radius: number,
  svg: SVGSVGElement
) => {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.x1.baseVal.value = origin.x;
  line.y1.baseVal.value = origin.y;
  line.x2.baseVal.value = target.x;
  line.y2.baseVal.value = target.y;
  line.style.strokeWidth = `${radius * 0.2}`;
  svg.append(line);
};

const getText = (x: number, y: number, size: number, text: string) => {
  const textP = document.createElementNS("http://www.w3.org/2000/svg", "text");
  textP.setAttribute("x", (x + 0.15).toString());
  textP.setAttribute("y", (y + size * 0.225).toString());
  textP.setAttribute("alignment-baselin", "middle");
  textP.setAttribute("text-anchor", "middle");
  textP.textContent = text;
  textP.style.stroke = "none";
  textP.style.fill = "white";
  textP.style.fontSize = `${size}px`;
  textP.style.lineHeight = "1";
  return textP;
};
