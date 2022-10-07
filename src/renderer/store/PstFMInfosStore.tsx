import type { ComputedDatum } from "@nivo/circle-packing";
import create from "zustand";

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
    setMainInfos: (update?: MainInfos | undefined) => void;
    startFocus: () => void;
}

export const usePstFMInfosStore = create<UsePstMainInfosStore>((set) => ({
    cancelFocus: () => {
        set({ isInfoFocus: false });
    },
    isInfoFocus: false,
    mainInfos: undefined,
    setMainInfos: (mainInfos: MainInfos | undefined) => {
        set({ mainInfos });
    },
    startFocus: () => {
        // trackerService?.getProvider().track("Feat(4.0) Detail Expanded");
        set({ isInfoFocus: true });
    },
}));
