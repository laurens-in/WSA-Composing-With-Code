import { Tree, findPaths, isLeaf, isNode } from "./tree";

export const renderTree = <T>(t: Tree<T>, container: HTMLDivElement) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  const obs = new ResizeObserver(() => {
    drawTree(t, svg, container);
  });
  drawTree(t, svg, container);
  obs.observe(container);

  const button = getDownload(svg, "tree.svg");

  container.append(button);
};

const getDownload = (svg: SVGSVGElement, name: string) => {
  const svgData = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.innerHTML = `<button style="position: absolute;"><svg xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" fill="currentColor" class="bi bi-file-earmark-arrow-down" viewBox="0 0 16 16">
                      <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
                      <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                    </svg></button>`;
  link.href = url;
  link.download = name;
  return link;
};

const drawTree = <T>(
  t: Tree<T>,
  svg: SVGSVGElement,
  container: HTMLDivElement
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
  circle.r.baseVal.value = r * 0.9;
  circle.style.strokeWidth = `${r * 0.2}`;
  circle.style.fill = "currentColor";

  group.append(circle);
  const text = getText(x, y, r, label);
  group.append(text);
  svg.append(group);
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
  textP.setAttribute("x", x.toString());
  textP.setAttribute("y", (y + size * 0.35).toString());
  textP.setAttribute("alignment-baselin", "middle");
  textP.setAttribute("text-anchor", "middle");
  textP.textContent = text;
  textP.style.stroke = "none";
  textP.style.fill = "white";
  textP.style.fontSize = `${size}px`;
  textP.style.lineHeight = "1";
  return textP;
};
