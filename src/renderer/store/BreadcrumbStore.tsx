import type { UnknownMapping } from "@common/utils/type";
import { t } from "i18next";
import { atom, useAtom } from "jotai/index";
import type { SetStateAction } from "react";
import { useEffect, useMemo } from "react";

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
    historyIds?: string[];
    id: BreadcrumbId | UnknownMapping;
}

export interface UseBreadcrumbStore {
    breadcrumb: BreadcrumbObject;
    resetBreadcrumb: () => void;
    setBreadcrumb: (update: SetStateAction<BreadcrumbObject>) => void;
}

const breadcrumbAtom = atom<BreadcrumbObject>({
    id: "",
});

const joinBreadcrumbHistory = (labels: string[] | undefined) =>
    labels?.join(CHEVRON);

export const makeBreadcrumb = (breadcrumb: BreadcrumbObject): string =>
    !breadcrumb.history?.length
        ? breadcrumb.id
        : `${joinBreadcrumbHistory(breadcrumb.history)} > ${breadcrumb.id}`;

export const useBreadcrumbStore = (
    allowUpdate?: boolean
): UseBreadcrumbStore => {
    const [breadcrumb, setBreadcrumb] = useAtom(breadcrumbAtom);
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
                setBreadcrumb(initialBreadcrumb);
            } else if (currentView && currentViewName) {
                if (prevIndex < currentIndex) {
                    setBreadcrumb((prevBreadcrumb) => {
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
                    setBreadcrumb((prevBreadcrumb) => {
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
        setBreadcrumb,
        allowUpdate,
        initialBreadcrumb,
    ]);

    const resetBreadcrumb = () => {
        setBreadcrumb(initialBreadcrumb);
    };

    return {
        breadcrumb,
        resetBreadcrumb,
        setBreadcrumb,
    };
};
