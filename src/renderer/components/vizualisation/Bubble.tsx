import { useService } from "@common/modules/ContainerModule";
import type { PstContent } from "@common/modules/pst-extractor/type";
import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";

import {
    createColorInterpolation,
    createGlobal,
    createPack,
    createRoot,
    createText,
} from "../../utils/bubble-builder";
import { LayoutWorkspace } from "../common/layout/LayoutWorkspace";
import { ClosePicto } from "../common/pictos/picto";
import style from "./Bubble.module.scss";

interface BubbleProps {
    closer: () => void;
}

// const json = {
//     children: [
//         {
//             children: [
//                 {
//                     children: [
//                         { name: "Chloé Moser", size: 3938 },
//                         { name: "Thibaut Larrède", size: 3812 },
//                         { name: "Mehdi Louraoui", size: 6714 },
//                         { name: "Lilian Saget", size: 743 },
//                     ],
//                     name: "sg.gouv.fr",
//                 },
//                 {
//                     children: [
//                         { name: "Paul René", size: 3534 },
//                         { name: "Younes Elatrach", size: 5731 },
//                         { name: "Oumar Sall", size: 7840 },
//                         { name: "Tom Chiss", size: 5014 },
//                         { name: "Vinz Menz", size: 10416 },
//                     ],
//                     name: "benextcompany.com",
//                 },
//                 {
//                     children: [{ name: "Léo Dls", size: 7074 }],
//                     name: "gmail.com",
//                 },
//             ],
//             name: "2001",
//         },
//         {
//             children: [
//                 { name: "Easing", size: 17010 },
//                 { name: "FunctionSequence", size: 5842 },
//                 {
//                     children: [
//                         { name: "ArrayInterpolator", size: 1983 },
//                         { name: "ColorInterpolator", size: 2047 },
//                         { name: "DateInterpolator", size: 1375 },
//                         { name: "Interpolator", size: 8746 },
//                         { name: "MatrixInterpolator", size: 2202 },
//                         { name: "NumberInterpolator", size: 1382 },
//                         { name: "ObjectInterpolator", size: 1629 },
//                         { name: "PointInterpolator", size: 1675 },
//                         { name: "RectangleInterpolator", size: 2042 },
//                     ],
//                     name: "interpolate",
//                 },
//                 { name: "ISchedulable", size: 1041 },
//                 { name: "Parallel", size: 5176 },
//                 { name: "Pause", size: 449 },
//                 { name: "Scheduler", size: 5593 },
//                 { name: "Sequence", size: 5534 },
//                 { name: "Transition", size: 9201 },
//                 { name: "Transitioner", size: 19975 },
//                 { name: "TransitionEvent", size: 1116 },
//                 { name: "Tween", size: 6006 },
//             ],
//             name: "animate",
//         },
//         {
//             children: [
//                 {
//                     children: [
//                         { name: "Converters", size: 721 },
//                         { name: "DelimitedTextConverter", size: 4294 },
//                         { name: "GraphMLConverter", size: 9800 },
//                         { name: "IDataConverter", size: 1314 },
//                         { name: "JSONConverter", size: 2220 },
//                     ],
//                     name: "converters",
//                 },
//                 { name: "DataField", size: 1759 },
//                 { name: "DataSchema", size: 2165 },
//                 { name: "DataSet", size: 586 },
//                 { name: "DataSource", size: 3331 },
//                 { name: "DataTable", size: 772 },
//                 { name: "DataUtil", size: 3322 },
//             ],
//             name: "data",
//         },
//         {
//             children: [
//                 { name: "DirtySprite", size: 8833 },
//                 { name: "LineSprite", size: 1732 },
//                 { name: "RectSprite", size: 3623 },
//                 { name: "TextSprite", size: 10066 },
//             ],
//             name: "display",
//         },
//         {
//             children: [{ name: "FlareVis", size: 4116 }],
//             name: "flex",
//         },
//         {
//             children: [
//                 { name: "DragForce", size: 1082 },
//                 { name: "GravityForce", size: 1336 },
//                 { name: "IForce", size: 319 },
//                 { name: "NBodyForce", size: 10498 },
//                 { name: "Particle", size: 2822 },
//                 { name: "Simulation", size: 9983 },
//                 { name: "Spring", size: 2213 },
//                 { name: "SpringForce", size: 1681 },
//             ],
//             name: "physics",
//         },
//         {
//             children: [
//                 { name: "AggregateExpression", size: 1616 },
//                 { name: "And", size: 1027 },
//                 { name: "Arithmetic", size: 3891 },
//                 { name: "Average", size: 891 },
//                 { name: "BinaryExpression", size: 2893 },
//                 { name: "Comparison", size: 5103 },
//                 { name: "CompositeExpression", size: 3677 },
//                 { name: "Count", size: 781 },
//                 { name: "DateUtil", size: 4141 },
//                 { name: "Distinct", size: 933 },
//                 { name: "Expression", size: 5130 },
//                 { name: "ExpressionIterator", size: 3617 },
//                 { name: "Fn", size: 3240 },
//                 { name: "If", size: 2732 },
//                 { name: "IsA", size: 2039 },
//                 { name: "Literal", size: 1214 },
//                 { name: "Match", size: 3748 },
//                 { name: "Maximum", size: 843 },
//                 {
//                     children: [
//                         { name: "add", size: 593 },
//                         { name: "and", size: 330 },
//                         { name: "average", size: 287 },
//                         { name: "count", size: 277 },
//                         { name: "distinct", size: 292 },
//                         { name: "div", size: 595 },
//                         { name: "eq", size: 594 },
//                         { name: "fn", size: 460 },
//                         { name: "gt", size: 603 },
//                         { name: "gte", size: 625 },
//                         { name: "iff", size: 748 },
//                         { name: "isa", size: 461 },
//                         { name: "lt", size: 597 },
//                         { name: "lte", size: 619 },
//                         { name: "max", size: 283 },
//                         { name: "min", size: 283 },
//                         { name: "mod", size: 591 },
//                         { name: "mul", size: 603 },
//                         { name: "neq", size: 599 },
//                         { name: "not", size: 386 },
//                         { name: "or", size: 323 },
//                         { name: "orderby", size: 307 },
//                         { name: "range", size: 772 },
//                         { name: "select", size: 296 },
//                         { name: "stddev", size: 363 },
//                         { name: "sub", size: 600 },
//                         { name: "sum", size: 280 },
//                         { name: "update", size: 307 },
//                         { name: "variance", size: 335 },
//                         { name: "where", size: 299 },
//                         { name: "xor", size: 354 },
//                         { name: "_", size: 264 },
//                     ],
//                     name: "methods",
//                 },
//                 { name: "Minimum", size: 843 },
//                 { name: "Not", size: 1554 },
//                 { name: "Or", size: 970 },
//                 { name: "Query", size: 13896 },
//                 { name: "Range", size: 1594 },
//                 { name: "StringUtil", size: 4130 },
//                 { name: "Sum", size: 791 },
//                 { name: "Variable", size: 1124 },
//                 { name: "Variance", size: 1876 },
//                 { name: "Xor", size: 1101 },
//             ],
//             name: "query",
//         },
//         {
//             children: [
//                 { name: "IScaleMap", size: 2105 },
//                 { name: "LinearScale", size: 1316 },
//                 { name: "LogScale", size: 3151 },
//                 { name: "OrdinalScale", size: 3770 },
//                 { name: "QuantileScale", size: 2435 },
//                 { name: "QuantitativeScale", size: 4839 },
//                 { name: "RootScale", size: 1756 },
//                 { name: "Scale", size: 4268 },
//                 { name: "ScaleType", size: 1821 },
//                 { name: "TimeScale", size: 5833 },
//             ],
//             name: "scale",
//         },
//         {
//             children: [
//                 { name: "Arrays", size: 8258 },
//                 { name: "Colors", size: 10001 },
//                 { name: "Dates", size: 8217 },
//                 { name: "Displays", size: 12555 },
//                 { name: "Filter", size: 2324 },
//                 { name: "Geometry", size: 10993 },
//                 {
//                     children: [
//                         { name: "FibonacciHeap", size: 9354 },
//                         { name: "HeapNode", size: 1233 },
//                     ],
//                     name: "heap",
//                 },
//                 { name: "IEvaluable", size: 335 },
//                 { name: "IPredicate", size: 383 },
//                 { name: "IValueProxy", size: 874 },
//                 {
//                     children: [
//                         { name: "DenseMatrix", size: 3165 },
//                         { name: "IMatrix", size: 2815 },
//                         { name: "SparseMatrix", size: 3366 },
//                     ],
//                     name: "math",
//                 },
//                 { name: "Maths", size: 17705 },
//                 { name: "Orientation", size: 1486 },
//                 {
//                     children: [
//                         { name: "ColorPalette", size: 6367 },
//                         { name: "Palette", size: 1229 },
//                         { name: "ShapePalette", size: 2059 },
//                         { name: "SizePalette", size: 2291 },
//                     ],
//                     name: "palette",
//                 },
//                 { name: "Property", size: 5559 },
//                 { name: "Shapes", size: 19118 },
//                 { name: "Sort", size: 6887 },
//                 { name: "Stats", size: 6557 },
//                 { name: "Strings", size: 22026 },
//             ],
//             name: "util",
//         },
//         {
//             children: [
//                 {
//                     children: [
//                         { name: "Axes", size: 1302 },
//                         { name: "Axis", size: 24593 },
//                         { name: "AxisGridLine", size: 652 },
//                         { name: "AxisLabel", size: 636 },
//                         { name: "CartesianAxes", size: 6703 },
//                     ],
//                     name: "axis",
//                 },
//                 {
//                     children: [
//                         { name: "AnchorControl", size: 2138 },
//                         { name: "ClickControl", size: 3824 },
//                         { name: "Control", size: 1353 },
//                         { name: "ControlList", size: 4665 },
//                         { name: "DragControl", size: 2649 },
//                         { name: "ExpandControl", size: 2832 },
//                         { name: "HoverControl", size: 4896 },
//                         { name: "IControl", size: 763 },
//                         { name: "PanZoomControl", size: 5222 },
//                         { name: "SelectionControl", size: 7862 },
//                         { name: "TooltipControl", size: 8435 },
//                     ],
//                     name: "controls",
//                 },
//                 {
//                     children: [
//                         { name: "Data", size: 20544 },
//                         { name: "DataList", size: 19788 },
//                         { name: "DataSprite", size: 10349 },
//                         { name: "EdgeSprite", size: 3301 },
//                         { name: "NodeSprite", size: 19382 },
//                         {
//                             children: [
//                                 { name: "ArrowType", size: 698 },
//                                 { name: "EdgeRenderer", size: 5569 },
//                                 { name: "IRenderer", size: 353 },
//                                 { name: "ShapeRenderer", size: 2247 },
//                             ],
//                             name: "render",
//                         },
//                         { name: "ScaleBinding", size: 11275 },
//                         { name: "Tree", size: 7147 },
//                         { name: "TreeBuilder", size: 9930 },
//                     ],
//                     name: "data",
//                 },
//                 {
//                     children: [
//                         { name: "DataEvent", size: 2313 },
//                         { name: "SelectionEvent", size: 1880 },
//                         { name: "TooltipEvent", size: 1701 },
//                         { name: "VisualizationEvent", size: 1117 },
//                     ],
//                     name: "events",
//                 },
//                 {
//                     children: [
//                         { name: "Legend", size: 20859 },
//                         { name: "LegendItem", size: 4614 },
//                         { name: "LegendRange", size: 10530 },
//                     ],
//                     name: "legend",
//                 },
//                 {
//                     children: [
//                         {
//                             children: [
//                                 { name: "BifocalDistortion", size: 4461 },
//                                 { name: "Distortion", size: 6314 },
//                                 { name: "FisheyeDistortion", size: 3444 },
//                             ],
//                             name: "distortion",
//                         },
//                         {
//                             children: [
//                                 { name: "ColorEncoder", size: 3179 },
//                                 { name: "Encoder", size: 4060 },
//                                 { name: "PropertyEncoder", size: 4138 },
//                                 { name: "ShapeEncoder", size: 1690 },
//                                 { name: "SizeEncoder", size: 1830 },
//                             ],
//                             name: "encoder",
//                         },
//                         {
//                             children: [
//                                 { name: "FisheyeTreeFilter", size: 5219 },
//                                 { name: "GraphDistanceFilter", size: 3165 },
//                                 { name: "VisibilityFilter", size: 3509 },
//                             ],
//                             name: "filter",
//                         },
//                         { name: "IOperator", size: 1286 },
//                         {
//                             children: [
//                                 { name: "Labeler", size: 9956 },
//                                 { name: "RadialLabeler", size: 3899 },
//                                 { name: "StackedAreaLabeler", size: 3202 },
//                             ],
//                             name: "label",
//                         },
//                         {
//                             children: [
//                                 { name: "AxisLayout", size: 6725 },
//                                 { name: "BundledEdgeRouter", size: 3727 },
//                                 { name: "CircleLayout", size: 9317 },
//                                 { name: "CirclePackingLayout", size: 12003 },
//                                 { name: "DendrogramLayout", size: 4853 },
//                                 { name: "ForceDirectedLayout", size: 8411 },
//                                 { name: "IcicleTreeLayout", size: 4864 },
//                                 { name: "IndentedTreeLayout", size: 3174 },
//                                 { name: "Layout", size: 7881 },
//                                 { name: "NodeLinkTreeLayout", size: 12870 },
//                                 { name: "PieLayout", size: 2728 },
//                                 { name: "RadialTreeLayout", size: 12348 },
//                                 { name: "RandomLayout", size: 870 },
//                                 { name: "StackedAreaLayout", size: 9121 },
//                                 { name: "TreeMapLayout", size: 9191 },
//                             ],
//                             name: "layout",
//                         },
//                         { name: "Operator", size: 2490 },
//                         { name: "OperatorList", size: 5248 },
//                         { name: "OperatorSequence", size: 4190 },
//                         { name: "OperatorSwitch", size: 2581 },
//                         { name: "SortOperator", size: 2023 },
//                     ],
//                     name: "operator",
//                 },
//                 { name: "Visualization", size: 16540 },
//             ],
//             name: "vis",
//         },
//     ],
//     name: "flare",
// };

export const Bubble: React.FC<BubbleProps> = ({ closer }) => {
    const ref = useRef(null);
    const [extractedFile, setExtractedFile] = useState<PstContent>();
    const pstExtractorService = useService("pstExtractorService");

    useEffect(() => {
        void (async () => {
            setExtractedFile(
                await pstExtractorService?.extract(
                    // "/Users/lsagetlethias/Downloads/PST/archive.pst"
                    "/Users/lsagetlethias/Downloads/test.pst"
                    // "/Users/lsagetlethias/Downloads/sample.pst"
                )
            );
        })();
    }, [pstExtractorService]);

    useEffect(() => {
        if (!extractedFile) {
            return;
        }

        const svg = d3.select(ref.current);
        const MARGIN = 20;
        const DIAMETER = +svg.attr("width");

        const global = createGlobal(svg, DIAMETER);
        const root = createRoot(extractedFile);
        const pack = createPack(DIAMETER, MARGIN);
        const nodes = pack(root).descendants();
        const color = createColorInterpolation();

        let focus = root;
        let view = 0;

        const circle = global
            .selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("class", function (d) {
                return d.parent
                    ? d.children
                        ? style.node
                        : [style.node, style["node--leaf"]].join(" ")
                    : [style.node, style["node--root"]].join(" ");
            })
            .style("fill", function (d) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return d.children ? color(d.depth) : null;
            })
            .on("click", function (d) {
                if (focus !== d) {
                    zoom(d);
                    d3.event.stopPropagation();
                }
            });

        const text = createText(global, nodes, root);

        const node = global.selectAll("circle,text");

        svg.style("background", color(-1)).on("click", function () {
            zoom(root);
        });

        zoomTo([root.x, root.y, root.r * 2 + MARGIN]);

        const zoom = (d) => {
            focus = d;

            const transition = d3
                .transition()
                .duration(750)
                .tween("zoom", (d) => {
                    const i = d3.interpolateZoom(
                        [2, 2, 2],
                        [focus.x, focus.y, focus.r * 2 + MARGIN]
                    );
                    return (t) => {
                        zoomTo(i(t));
                    };
                });

            transition
                .selectAll("text")
                .filter(function (d) {
                    return (
                        d.parent === focus || this.style.display === "inline"
                    );
                })
                .style("fill-opacity", function (d) {
                    return d.parent === focus ? 1 : 0;
                })
                .on("start", function (d) {
                    if (d.parent === focus) this.style.display = "inline";
                })
                .on("end", function (d) {
                    if (d.parent !== focus) this.style.display = "none";
                });
        };

        function zoomTo(v) {
            const k = DIAMETER / v[2];
            view = v;
            node.attr("transform", (d) => {
                console.log(d, v, k);
                console.log((d.x - v[0]) * k);
                console.log((d.y - v[1]) * k);
                return `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`;
            });
            circle.attr("r", (d) => d.r * k);
        }
    }, [extractedFile]);
    return (
        <LayoutWorkspace classname={style.bubble}>
            <button className={style.close} onClick={closer}>
                <ClosePicto />
            </button>
            <svg
                className={style["bubble-element"]}
                width="750"
                height="750"
                ref={ref}
            />
        </LayoutWorkspace>
    );
};
