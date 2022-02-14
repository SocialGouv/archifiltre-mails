/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Fragment } from "react";

import { useContextMenu } from "../../hooks/useContextMenu";
import { useTagManagerStore } from "../../store/TagManagerStore";
import style from "./Menu.module.scss";

export const Menu: React.FC = () => {
    const { anchorPoint, show } = useContextMenu();

    const { addMarkedToDelete, addMarkedToKeep } = useTagManagerStore();

    if (show) {
        return (
            <ul
                id="menu"
                className={style.menu}
                style={{ left: anchorPoint.x, top: anchorPoint.y }}
            >
                <li
                    onClick={addMarkedToDelete}
                    id="to-delete-btn"
                    className="to-delete-btn"
                >
                    Supprimé
                </li>
                <li id="to-keep-btn" onClick={addMarkedToKeep}>
                    Conservé
                </li>
            </ul>
        );
    }
    return <></>;
};
