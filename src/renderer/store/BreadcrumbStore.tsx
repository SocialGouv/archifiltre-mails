import type { ComputedDatum } from "@nivo/circle-packing";
import { atom, useAtom } from "jotai/index";
import type { SetStateAction } from "react";

import type { ViewerObject } from "../utils/dashboard-viewer-dym";

export type MainInfos = ComputedDatum<ViewerObject<string>>;

export interface UseBreadcrumbStore {
    breadcrumb: string;
    setBreadcrumb: (update: SetStateAction<string>) => void;
}

const breadcrumbAtom = atom<string>("domaine"); // TODO: i18n

export const useBreadcrumbStore = (): UseBreadcrumbStore => {
    const [breadcrumb, setBreadcrumb] = useAtom(breadcrumbAtom);

    return {
        breadcrumb,
        setBreadcrumb,
    };
};
