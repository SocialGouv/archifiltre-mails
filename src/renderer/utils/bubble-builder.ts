// /* eslint-disable @typescript-eslint/no-unsafe-return */

// import * as d3 from "d3";

// export const createText = (global, nodes, root) =>
//     global
//         .selectAll("text")
//         .data(nodes)
//         .enter()
//         .append("text")
//         .attr("class", "label")
//         .style("fill-opacity", (currentData) =>
//             currentData.parent === root ? 1 : 0
//         )
//         .style("display", (currentData) =>
//             currentData.parent === root ? "inline" : "none"
//         )
//         .text((currentData) => currentData.data.name);

// export const createGlobal = (svg, DIAMETER) =>
//     svg
//         .append("g")
//         .attr("transform", `translate(${DIAMETER / 2},${DIAMETER / 2})`);

// export const createColorInterpolation = () =>
//     d3
//         .scaleLinear()
//         .domain([-1, 5])
//         // .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
//         .range(["#f6f9fe", "#000"])
//         .interpolate(d3.interpolateHcl);

// export const createPack = (DIAMETER, MARGIN) =>
//     d3
//         .pack()
//         .size([DIAMETER - MARGIN, DIAMETER - MARGIN])
//         .padding(2);

// export const createRoot = (json) =>
//     d3
//         .hierarchy(json)
//         .sum((d) => d.size)
//         .sort((a, b) => b.value - a.value);
