import { atom, useAtom } from "jotai/index";
import type { SetStateAction } from "react";

import type { LocaleFileResources } from "../../common/i18n/raw";

export type BreadcrumbId = {
    [K in keyof LocaleFileResources["translation"]]: K extends `dashboard.viewer.breadcrumb.id.${infer R}`
        ? R
        : never;
}[keyof LocaleFileResources["translation"]];

export interface BreadcrumbObject {
    id: BreadcrumbId;
    history?: string[];
}

export interface UseBreadcrumbStore {
    breadcrumb: BreadcrumbObject;
    setPreviousBreadcrumb: (id: BreadcrumbId) => void;
    setBreadcrumb: (update: SetStateAction<BreadcrumbObject>) => void;
}

const breadcrumbAtom = atom<BreadcrumbObject>({
    id: "domain",
});

export const useBreadcrumbStore = (): UseBreadcrumbStore => {
    const [breadcrumb, setBreadcrumb] = useAtom(breadcrumbAtom);

    const setPreviousBreadcrumb = (id: BreadcrumbId) => {
        setBreadcrumb((prevBreadcrumb) => {
            const history = prevBreadcrumb.history;
            history?.pop();
            return {
                history,
                id,
            };
        });
    };

    return {
        breadcrumb,
        setBreadcrumb,
        setPreviousBreadcrumb,
    };
};
