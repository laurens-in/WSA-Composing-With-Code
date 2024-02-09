import cytoscape from "cytoscape";
import { NodeSingular } from "cytoscape";

export const visualize = (
  g: Graph,
  container: HTMLDivElement | null | undefined
): cytoscape.Core => {
  const vertices = g.vertices.map(
    (v) => ({ data: v } as cytoscape.NodeDataDefinition)
  );
  const edges = g.edges.map(
    (v) =>
      ({
        data: { id: `${v[0]}${v[1]}`, source: v[0], target: v[1] },
      } as cytoscape.NodeDataDefinition)
  );

  const elements = [...edges, ...vertices] as cytoscape.ElementDefinition[];

  return cytoscape({
    container: container, // container to render in
    elements: elements,
    style: [
      {
        selector: "node",
        style: {
          "background-color": "#666",
          label: "data(name)".toString(),
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
          style: { backgroundColor: "black" },
        },
        {
          duration: 500,
        }
      );
  });
};
