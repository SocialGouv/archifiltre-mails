/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";

import {
    DELETE_ACTION_BUTTON_ID,
    KEEP_ACTION_BUTTON_ID,
    useContextMenu,
} from "../../hooks/useContextMenu";
import { useTagManagerStore } from "../../store/TagManagerStore";
import style from "./Menu.module.scss";

export const Menu: React.FC = () => {
    const { t } = useTranslation();
    const { anchorPoint, show } = useContextMenu();

    const { addMarkedToDelete, addMarkedToKeep } = useTagManagerStore();

    if (show) {
        return (
            <ul
                className={style.menu}
                style={{ left: anchorPoint.x, top: anchorPoint.y }}
            >
                <li
                    onClick={addMarkedToDelete}
                    id={DELETE_ACTION_BUTTON_ID}
                    className={DELETE_ACTION_BUTTON_ID}
                >
                    {t("dashboard.viewer.contextMenu.deleteAction")}
                </li>
                <li
                    id={KEEP_ACTION_BUTTON_ID}
                    className={KEEP_ACTION_BUTTON_ID}
                    onClick={addMarkedToKeep}
                >
                    {t("dashboard.viewer.contextMenu.keepAction")}
                </li>
            </ul>
        );
    }
    return <></>;
};
