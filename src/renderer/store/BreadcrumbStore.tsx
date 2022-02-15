import type { ComputedDatum } from "@nivo/circle-packing";
import type { Atom } from "jotai/index";
import { atom, useAtom } from "jotai/index";
import type { SetStateAction } from "react";
import type { TFunction } from "react-i18next";
import { useTranslation } from "react-i18next";

import type { ViewerObject } from "../utils/dashboard-viewer-dym";

export type MainInfos = ComputedDatum<ViewerObject<string>>;

export interface UseBreadcrumbStore {
    breadcrumb: string;
    setBreadcrumb: (update: SetStateAction<string>) => void;
}

let breadcrumbAtom: Atom<string> | null = null;
const getBreadcrumbAtom = (t: TFunction) =>
    (breadcrumbAtom =
        breadcrumbAtom ??
        atom<string>(t("dashboard.viewer.breadcrumb.domain"))); // TODO: change because dynamic

export const useBreadcrumbStore = (): UseBreadcrumbStore => {
    const { t } = useTranslation();
    const [breadcrumb, setBreadcrumb] = useAtom(getBreadcrumbAtom(t));

    return {
        breadcrumb,
        setBreadcrumb,
    };
};
