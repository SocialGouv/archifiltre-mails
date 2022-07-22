import create from "zustand";

import type { ViewState } from "../hooks/useDymViewerNavigation";
import type { DefaultViewerObject } from "../utils/dashboard-viewer-dym";

export interface ViewListStore {
    addViewsCallback: (...views: ViewListStore["list"]) => void;
    addViewsGetter: (...views: ViewListStore["list"]) => void;
    currentIndex: number;
    list: ViewState<DefaultViewerObject>[];
    setCurrentIndex: (currentIndex: ViewListStore["currentIndex"]) => void;
    setList: (list: ViewListStore["list"]) => void;
}
export const viewListStore = create<ViewListStore>((set, get) => ({
    addViewsCallback: (...views: ViewState<DefaultViewerObject>[]) => {
        set((currentState) => {
            currentState.list.push(...views);
        });
    },
    addViewsGetter: (...views: ViewState<DefaultViewerObject>[]) => {
        set({
            list: [...get().list, ...views],
        });
    },
    currentIndex: 0,
    list: [],
    setCurrentIndex: (currentIndex) => {
        set({ currentIndex });
    },
    setList: (list) => {
        set({ list });
    },
}));
