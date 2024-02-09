import { Tree, findPaths, isLeaf, isNode } from "./tree";

export const drawTree = <T>(t: Tree<T>, container: HTMLDivElement) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const ratio = container.clientHeight / container.clientWidth;
  svg.setAttribute("viewBox", `0 0 120 ${120 * ratio}`);
  svg.setAttribute("preserveAspectRatio", "none");
  console.log(`0 0 120 ${120 * ratio}`);

  const size =
    container.clientWidth > container.clientHeight
      ? container.clientHeight
      : container.clientWidth;

  // svg.width.baseVal.valueAsString = `${size}px`;
  // svg.height.baseVal.valueAsString = `${size}px`;
  svg.width.baseVal.valueAsString = `${container.clientWidth}px`;
  svg.height.baseVal.valueAsString = `${container.clientHeight}px`;
  svg.style.backgroundColor = "#EBB3E2";

  container.append(svg);

  const width = 100;

  const padding = 10;
  const depth = findPaths(t).reduce((p, c) => (p > c.length ? p : c.length), 0);
  const breadth = Math.pow(2, depth - 1);

  const spaces = breadth * 2 - 1;
  const radius = (100 / spaces) * 0.8;
  const indents = [
    0,
    ...[...Array(depth - 1).keys()].map((v) => Math.pow(2, v)).reverse(),
  ];

  recursiveDraw(
    t,
    svg,
    { x: width / 2 + padding, y: radius + (padding * ratio) / 2 },
    radius,
    padding,
    {
      h: 100 / spaces,
      v: ((100 - 2 * radius) * ratio) / (depth - 1),
    },
    indents,
    0
  );
};

const recursiveDraw = <T>(
  node: Tree<T>,
  svg: SVGSVGElement,
  position: { x: number; y: number },
  radius: number,
  padding: number,
  space: { h: number; v: number },
  indents: number[],
  depth = 0
) => {
  if (isNode(node)) {
    if (node.left) {
      const nextLeftPosition = {
        x: position.x - indents[depth + 1] * space.h,
        y: position.y + space.v,
      };
      drawLine(position, nextLeftPosition, indents.length, svg);
      recursiveDraw(
        node.left,
        svg,
        nextLeftPosition,
        radius,
        padding,
        space,
        indents,
        depth + 1
      );
    }
    if (node.right) {
      const nextRightPosition = {
        x: position.x + indents[depth + 1] * space.h,
        y: position.y + space.v,
      };
      drawLine(position, nextRightPosition, indents.length, svg);
      recursiveDraw(
        node.right,
        svg,
        nextRightPosition,
        radius,
        padding,
        space,
        indents,
        depth + 1
      );
    }
  }

  drawCircle(
    position.x,
    position.y,
    radius,
    (node.data as number).toString(),
    svg
  );
  // drawText(
  //   position.x,
  //   position.y,
  //   radius,
  //   (node.data as number).toString(),
  //   svg
  // );

  if (isLeaf(node)) return;
};

const drawCircle = (
  x: number,
  y: number,
  r: number,
  label: string,
  svg: SVGSVGElement
) => {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  circle.cx.baseVal.value = x;
  circle.cy.baseVal.value = y;
  circle.r.baseVal.value = r;
  circle.style.fill = "currentColor";

  group.append(circle);
  const text = getText(x, y, r, label);
  group.append(text);
  svg.append(group);
};

const drawLine = (
  origin: { x: number; y: number },
  target: { x: number; y: number },
  depth: number,
  svg: SVGSVGElement
) => {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.x1.baseVal.value = origin.x;
  line.y1.baseVal.value = origin.y;
  line.x2.baseVal.value = target.x;
  line.y2.baseVal.value = target.y;
  line.style.stroke = "gray";
  line.style.strokeWidth = `${2 / depth}px`;
  svg.append(line);
};

const getText = (x: number, y: number, size: number, text: string) => {
  const textP = document.createElementNS("http://www.w3.org/2000/svg", "text");
  textP.setAttribute("x", x.toString());
  textP.setAttribute("y", (y + size * 0.3).toString());
  textP.setAttribute("alignment-baselin", "middle");
  textP.setAttribute("text-anchor", "middle");
  textP.textContent = text;
  textP.style.stroke = "none";
  textP.style.fill = "white";
  textP.style.fontSize = `${size}px`;
  textP.style.lineHeight = "1";
  textP.style.fontFamily = "monospace";
  return textP;
};
