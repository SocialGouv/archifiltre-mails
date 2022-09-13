import create from "zustand";

import type { ViewState } from "../hooks/useDymViewerNavigation";
import type { DefaultViewerObject } from "../utils/dashboard-viewer-dym";

export interface ViewListStore {
    // Both unused. Replace by setViewAt, prefered behaviour. Maybe should be deleted.

    // addViewsCallback: (...views: ViewListStore["list"]) => void;
    // addViewsGetter: (...views: ViewListStore["list"]) => void;
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
    // addViewsCallback: (...views: ViewState<DefaultViewerObject>[]) => {
    //     set((currentState) => {
    //         currentState.list.push(...views);
    //     });
    // },
    // addViewsGetter: (...views: ViewState<DefaultViewerObject>[]) => {
    //     set({
    //         list: [...get().list, ...views],
    //     });
    // },
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
