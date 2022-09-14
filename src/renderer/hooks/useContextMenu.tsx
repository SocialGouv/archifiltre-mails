import { useCallback, useEffect } from "react";

export type CustomContextMenuMouseEvent = MouseEvent & {
    _customData?: { contextMenu: boolean };
};

export const DELETE_ACTION_BUTTON_ID = "delete-action-btn";
export const KEEP_ACTION_BUTTON_ID = "keep-action-btn";

export const useContextMenu = (element: HTMLDivElement | null): void => {
    const handleContextMenu = useCallback((event: MouseEvent) => {
        event.preventDefault();

        const elt = document.elementFromPoint(event.clientX, event.clientY);

        const customEvent = new MouseEvent(
            "click", // or "mousedown" if the canvas listens for such an event
            {
                bubbles: true,
                clientX: event.clientX,
                clientY: event.clientY,
            }
        ) as CustomContextMenuMouseEvent;
        customEvent._customData = {
            contextMenu: true,
        };
        elt?.dispatchEvent(customEvent);
    }, []);

    useEffect(() => {
        element?.addEventListener("contextmenu", handleContextMenu);

        return () => {
            element?.removeEventListener("contextmenu", handleContextMenu);
        };
    }, [element, handleContextMenu]);
};
