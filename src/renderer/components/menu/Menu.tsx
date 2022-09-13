/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from "react";
import { useTranslation } from "react-i18next";

import {
    DELETE_ACTION_BUTTON_ID,
    KEEP_ACTION_BUTTON_ID,
    useContextMenu,
} from "../../hooks/useContextMenu";
import { tagManagerStoreV2 } from "../../store/TagManagerStoreV2";
import style from "./Menu.module.scss";

export const Menu: React.FC = () => {
    const { t } = useTranslation();
    const { anchorPoint, show, closeMenu } = useContextMenu();

    const { setDeleteIds, setKeepIds } = tagManagerStoreV2();

    if (show) {
        return (
            <ul
                className={style.menu}
                style={{ left: anchorPoint.x, top: anchorPoint.y }}
            >
                <li
                    onClick={() => {
                        setDeleteIds();
                        closeMenu();
                        // addMarkedToDelete();
                    }}
                    id={DELETE_ACTION_BUTTON_ID}
                    className={DELETE_ACTION_BUTTON_ID}
                >
                    {t("dashboard.viewer.contextMenu.deleteAction")}
                </li>
                <li
                    id={KEEP_ACTION_BUTTON_ID}
                    className={KEEP_ACTION_BUTTON_ID}
                    onClick={() => {
                        setKeepIds();
                        closeMenu();
                    }}
                    // onClick={addMarkedToKeep}
                >
                    {t("dashboard.viewer.contextMenu.keepAction")}
                </li>
            </ul>
        );
    }
    return <></>;
};
