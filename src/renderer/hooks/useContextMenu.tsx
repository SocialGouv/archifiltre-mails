import { useCallback, useEffect, useState } from "react";

import { useTagManagerStore } from "../store/TagManagerStore";
import { CIRCLE_PACKING_ID } from "../utils/constants";

interface UseContextMenuType {
    anchorPoint: {
        x: number;
        y: number;
    };
    show?: boolean;
}

export const useContextMenu = (): UseContextMenuType => {
    const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
    const [show, setShow] = useState<UseContextMenuType["show"]>(false);
    const { addMarkedToDelete } = useTagManagerStore();

    const handleMarkedToDelete = useCallback(() => {
        addMarkedToDelete();
    }, [addMarkedToDelete]);

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

    const menu = document.querySelector(CIRCLE_PACKING_ID);
    const markedToDeleteBtn = document.querySelector("#to-delete-btn");
    const markedToKeepBtn = document.querySelector("#to-keep-btn");

    useEffect(() => {
        menu?.addEventListener("click", handleClick);
        menu?.addEventListener("contextmenu", handleContextMenu);
        markedToDeleteBtn?.addEventListener("click", handleMarkedToDelete);

        return () => {
            menu?.removeEventListener("click", handleClick);
            menu?.removeEventListener("contextmenu", handleContextMenu);
            markedToDeleteBtn?.removeEventListener(
                "click",
                handleMarkedToDelete
            );
        };
    }, [
        handleClick,
        handleContextMenu,
        handleMarkedToDelete,
        menu,
        markedToKeepBtn,
        markedToDeleteBtn,
    ]);
    return { anchorPoint, show };
};
