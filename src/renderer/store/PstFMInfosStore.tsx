import { useService } from "@common/modules/ContainerModule";
import type { ComputedDatum } from "@nivo/circle-packing";
import { atom, useAtom } from "jotai/index";
import type { SetStateAction } from "react";

import type {
    MailViewerObject,
    ViewerObject,
} from "../utils/dashboard-viewer-dym";
import { isMailViewerObject } from "../utils/dashboard-viewer-dym";

export type MainInfos = ComputedDatum<ViewerObject<string>>;

export const isMailMainInfos = (
    mainInfos: MainInfos
): mainInfos is ComputedDatum<MailViewerObject<string>> =>
    isMailViewerObject(mainInfos.data);

export interface UsePstMainInfosStore {
    cancelFocus: () => void;
    isInfoFocus: boolean;
    mainInfos: MainInfos | undefined;
    setMainInfos: (update?: SetStateAction<MainInfos | undefined>) => void;
    startFocus: () => void;
}

const pstMainInfosAtom = atom<MainInfos | undefined>(undefined);
const isInfoFocusAtom = atom<boolean>(false);

/**
 * A hook that exposes Folder and Mails informations. (FM: accronym for Folder & Mails)
 */
export const usePstFMInfosStore = (): UsePstMainInfosStore => {
    const [mainInfos, setMainInfos] = useAtom(pstMainInfosAtom);

    const [isInfoFocus, setIsInfoFocus] = useAtom(isInfoFocusAtom);
    const trackerService = useService("trackerService");

    const startFocus = () => {
        trackerService?.getProvider().track("Feat(4.0) Detail Expanded");
        setIsInfoFocus(true);
    };

    const cancelFocus = () => {
        setIsInfoFocus(false);
    };

    return {
        cancelFocus,
        isInfoFocus,
        mainInfos,
        setMainInfos,
        startFocus,
    };
};
