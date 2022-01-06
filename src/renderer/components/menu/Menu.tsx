import React, { Fragment } from "react";

import { useContextMenu } from "../../../renderer/hooks/useContextMenu";
import style from "./Menu.module.scss";

export const Menu: React.FC = () => {
    const { anchorPoint, show } = useContextMenu();

    // const _getChildrenId = (id?: any) => {
    //     if (!pstFile) return null;

    //     return (
    //         main.children
    //             .reduce((ids: any, child: any) => {
    //                 // console.log({ child, ids });
    //                 return [...ids, ..._getChildrenId(child.id), child.id];
    //             }, [])
    //             .flat() ?? []
    //     );
    // };
    // const getChildrenId = (id?: any) => {
    //     if (!main) return null;

    //     return (
    //         main.children
    //             .find((root: any) => {
    //                 return root.id === id;
    //             })
    //             ?.children.reduce(
    //                 (ids: any, child: any) => [
    //                     ...ids,
    //                     ...getChildrenId(child.id),
    //                     child.id,
    //                 ],
    //                 []
    //             )
    //             .flat() ?? []
    //     );
    // };

    if (show) {
        return (
            <ul
                id="menu"
                className={style.menu}
                style={{ left: anchorPoint.x, top: anchorPoint.y }}
            >
                <li id="to-delete-btn">Supprimé</li>
                <li>Non marqué</li>
                <li id="to-keep-btn">Conservé</li>
            </ul>
        );
    }
    return <Fragment />;
};
