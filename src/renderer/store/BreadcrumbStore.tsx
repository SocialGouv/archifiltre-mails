import type { UnknownMapping } from "@common/utils/type";
import { atom, useAtom } from "jotai/index";
import type { SetStateAction } from "react";

import type { LocaleFileResources } from "../../common/i18n/raw";

export type BreadcrumbId = {
    [K in keyof LocaleFileResources["translation"]]: K extends `dashboard.viewer.breadcrumb.id.${infer R}`
        ? R
        : never;
}[keyof LocaleFileResources["translation"]];

export interface BreadcrumbObject {
    history?: string[];
    id: BreadcrumbId | UnknownMapping;
}

export interface UseBreadcrumbStore {
    breadcrumb: BreadcrumbObject;
    setBreadcrumb: (update: SetStateAction<BreadcrumbObject>) => void;
    setPreviousBreadcrumb: (id: BreadcrumbObject["id"]) => void;
}

const breadcrumbAtom = atom<BreadcrumbObject>({
    id: "domain", // TODO: custom
});

export const useBreadcrumbStore = (): UseBreadcrumbStore => {
    const [breadcrumb, setBreadcrumb] = useAtom(breadcrumbAtom);

    const setPreviousBreadcrumb = (id: BreadcrumbObject["id"]) => {
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
