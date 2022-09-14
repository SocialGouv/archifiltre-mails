import create from "zustand";

import type { ViewState } from "../hooks/useDymViewerNavigation";
import type { DefaultViewerObject } from "../utils/dashboard-viewer-dym";

export interface ViewListStore {
    currentIndex: number;
    list: ViewState<DefaultViewerObject>[];
    prevIndex: number;
    setCurrentIndex: (currentIndex: ViewListStore["currentIndex"]) => void;
    setList: (list: ViewListStore["list"]) => void;

    setViewAt: (
        index: ViewListStore["currentIndex"],
        view: ViewListStore["list"][ViewListStore["currentIndex"]]
    ) => void;
}
export const viewListStore = create<ViewListStore>((set, get) => ({
    currentIndex: 0,
    list: [],
    prevIndex: -1,
    setCurrentIndex: (currentIndex) => {
        set((prevState) => ({
            currentIndex,
            prevIndex: prevState.currentIndex,
        }));
    },
    setList: (list) => {
        set({ list });
    },
    setViewAt: (index: number, view: ViewState<DefaultViewerObject>) => {
        const list = get().list;
        list[index] = view;

        set({
            list,
        });
    },
}));
