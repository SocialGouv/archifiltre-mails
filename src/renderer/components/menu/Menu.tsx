import React, { Fragment, useRef } from "react";

import { useContextMenu } from "../../hooks/useContextMenu";
import style from "./Menu.module.scss";

export const Menu: React.FC = () => {
    const { anchorPoint, show, handleMarkedToDelete } = useContextMenu();

    const deleteBtn = useRef(null);

    if (show) {
        return (
            <ul
                id="menu"
                className={style.menu}
                style={{ left: anchorPoint.x, top: anchorPoint.y }}
            >
                <li
                    onClick={handleMarkedToDelete}
                    id="to-delete-btn"
                    className="to-delete-btn"
                >
                    Supprimé
                </li>
                {/* <li>Non marqué</li> */}
                <li id="to-keep-btn">Conservé</li>
            </ul>
        );
    }
    return <></>;
};
