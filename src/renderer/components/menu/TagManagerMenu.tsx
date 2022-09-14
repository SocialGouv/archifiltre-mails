/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import type { CSSProperties, Dispatch, SetStateAction } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import {
    DELETE_ACTION_BUTTON_ID,
    KEEP_ACTION_BUTTON_ID,
} from "../../hooks/useContextMenuEventAsClick";
import { tagManagerStore } from "../../store/TagManagerStore";
import style from "./Menu.module.scss";

interface ITagManagerMenu {
    anchorX: number;
    anchorY: number;
    setShow: Dispatch<SetStateAction<boolean>>;
    show: boolean;
}

const cancellableZoneCSS: CSSProperties = {
    height: "100vh",
    left: "0",
    position: "fixed",
    top: "0",
    width: "100vw",
};

export const TagManagerMenu: React.FC<ITagManagerMenu> = ({
    anchorX,
    anchorY,
    show,
    setShow,
}) => {
    const { t } = useTranslation();

    const { setDeleteIds, setKeepIds } = tagManagerStore();
    if (!show) return null;
    return (
        <>
            <ul
                id="tag-manager-menu"
                className={style.menu}
                style={{ left: anchorX, top: anchorY }}
            >
                <li
                    onClick={() => {
                        setDeleteIds();
                        setShow(false);
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
                        setShow(false);
                    }}
                >
                    {t("dashboard.viewer.contextMenu.keepAction")}
                </li>
            </ul>
            <div
                style={cancellableZoneCSS}
                onClick={() => {
                    setShow(false);
                }}
            />
        </>
    );
};
