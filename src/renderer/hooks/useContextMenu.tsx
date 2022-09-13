import { useCallback, useEffect, useState } from "react";

import { CIRCLE_PACKING_ID } from "../utils/constants";

interface UseContextMenuType {
    anchorPoint: {
        x: number;
        y: number;
    };
    closeMenu: () => void;
    show?: boolean;
}

export const DELETE_ACTION_BUTTON_ID = "delete-action-btn";
export const KEEP_ACTION_BUTTON_ID = "keep-action-btn";

export const useContextMenu = (): UseContextMenuType => {
    const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
    const [show, setShow] = useState<UseContextMenuType["show"]>(false);

    const handleContextMenu = useCallback(
        (event) => {
            event.preventDefault();
            setAnchorPoint({ x: event.pageX, y: event.pageY });
            setShow(true);
        },
        [setShow, setAnchorPoint]
    );

    const handleClick = useCallback(() => {
        if (show) {
            setShow(false);
        }
        setShow(void 0);
    }, [show]);

    const circlePackingViewer = document.querySelector(CIRCLE_PACKING_ID);
    const markedToDeleteBtn = document.querySelector(
        `#${DELETE_ACTION_BUTTON_ID}`
    );
    const markedToKeepBtn = document.querySelector(`#${KEEP_ACTION_BUTTON_ID}`);

    const closeMenu = () => {
        setShow(false);
    };

    useEffect(() => {
        circlePackingViewer?.addEventListener("click", handleClick);
        circlePackingViewer?.addEventListener("contextmenu", handleContextMenu);

        return () => {
            circlePackingViewer?.removeEventListener("click", handleClick);
            circlePackingViewer?.removeEventListener(
                "contextmenu",
                handleContextMenu
            );
        };
    }, [
        circlePackingViewer,
        markedToKeepBtn,
        markedToDeleteBtn,
        handleClick,
        handleContextMenu,
    ]);
    return { anchorPoint, closeMenu, show };
};
