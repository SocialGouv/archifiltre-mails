import React from "react";

import type { DispatchUpdater } from "../../utils/type";
import type { InitialTreeProps } from "./Tree";
import style from "./Tree.module.scss";

interface TreeControlsProps {
    tree: InitialTreeProps;
    updateTree: DispatchUpdater<InitialTreeProps>;
}

export const TreeControls: React.FC<TreeControlsProps> = ({
    updateTree,
    tree,
}) => {
    return (
        <ul className={style.treeControls}>
            <li>
                <label htmlFor="tree-ctrl-orientation">Orientation: </label>
                <select
                    name="tree-ctrl-orientation"
                    onChange={(event) => {
                        updateTree({ orientation: event.target.value });
                    }}
                    value={tree.orientation}
                >
                    <option value="horizontal">Horizontal</option>
                    <option value="vertical">Vertical</option>
                </select>
            </li>
            <li>
                <label htmlFor="tree-ctrl-width">Largeur:</label>
                <input
                    type="number"
                    name="tree-ctrl-width"
                    min={50}
                    max={1500}
                    step={10}
                    value={tree.nodeSize.x}
                    onChange={(event) => {
                        updateTree({
                            nodeSize: {
                                x: event.target.value,
                                y: tree.nodeSize.y,
                            },
                        });
                    }}
                />
            </li>
            <li>
                <label htmlFor="tree-ctrl-height">Hauteur:</label>
                <input
                    type="number"
                    name="tree-ctrl-height"
                    min={10}
                    max={1500}
                    step={10}
                    value={tree.nodeSize.y}
                    onChange={(event) => {
                        updateTree({
                            nodeSize: {
                                x: tree.nodeSize.x,
                                y: event.target.value,
                            },
                        });
                    }}
                />
            </li>
        </ul>
    );
};
