import type { UnknownMapping } from "@common/utils/type";
import { t } from "i18next";
import { useEffect, useMemo } from "react";
import create from "zustand";

import type { LocaleFileResources } from "../../common/i18n/raw";
import { viewListStore } from "./ViewListStore";

const CHEVRON = " > ";
const BREADCRUMB_TRANSLATE_LABEL_ID = "dashboard.viewer.breadcrumb.id.label.";

export type BreadcrumbId = {
    [K in keyof LocaleFileResources["translation"]]: K extends `dashboard.viewer.breadcrumb.id.label.${infer R}`
        ? R
        : never;
}[keyof LocaleFileResources["translation"]];

export interface BreadcrumbObject {
    history?: string[];
    id: BreadcrumbId | UnknownMapping;
}

export interface UseBreadcrumbStore {
    breadcrumb: BreadcrumbObject;
    resetBreadcrumb: () => void;
}

const joinBreadcrumbHistory = (labels: string[] | undefined) =>
    labels?.join(CHEVRON);

export const makeBreadcrumb = (breadcrumb: BreadcrumbObject): string =>
    !breadcrumb.history?.length
        ? breadcrumb.id
        : `${joinBreadcrumbHistory(breadcrumb.history)} > ${breadcrumb.id}`;

interface UseBreadcrumbStoreOptions {
    allowUpdate: boolean;
}
const defaultOptions: UseBreadcrumbStoreOptions = { allowUpdate: false };

const breadcrumbStore = create<BreadcrumbObject>(() => ({
    history: [],
    id: "",
}));

export const useBreadcrumbStore = ({
    allowUpdate,
} = defaultOptions): UseBreadcrumbStore => {
    const breadcrumb = breadcrumbStore();
    const { list, currentIndex, prevIndex } = viewListStore();

    const initialType = list[0]
        ? t(`${BREADCRUMB_TRANSLATE_LABEL_ID}${list[0].type}`)
        : "";
    const currentView = list[currentIndex];
    const currentViewName = currentView?.elements.name;
    const currentViewType = t(
        `${BREADCRUMB_TRANSLATE_LABEL_ID}${currentView?.type}`
    );

    const initialBreadcrumb: BreadcrumbObject = useMemo(
        () => ({
            history: [],
            id: initialType,
        }),
        [initialType]
    );

    useEffect(() => {
        if (allowUpdate) {
            if (currentIndex === 0) {
                breadcrumbStore.setState(initialBreadcrumb);
            } else if (currentView && currentViewName) {
                if (prevIndex < currentIndex) {
                    breadcrumbStore.setState((prevBreadcrumb) => {
                        const { history } = prevBreadcrumb;

                        const newHistory = !history?.length
                            ? [currentViewName]
                            : [...history, currentViewName];

                        return {
                            history: newHistory,
                            id: currentViewType,
                        };
                    });
                } else {
                    breadcrumbStore.setState((prevBreadcrumb) => {
                        const history = prevBreadcrumb.history ?? [];
                        history.pop();
                        return {
                            history,
                            id: currentViewType,
                        };
                    });
                }
            }
        }
    }, [
        currentIndex,
        currentView,
        currentViewName,
        currentViewType,
        list,
        prevIndex,
        allowUpdate,
        initialBreadcrumb,
    ]);

    const resetBreadcrumb = () => {
        breadcrumbStore.setState(initialBreadcrumb);
    };

    return {
        breadcrumb,
        resetBreadcrumb,
    };
};
