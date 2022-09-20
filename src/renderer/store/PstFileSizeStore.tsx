import { bytesToMegabytes } from "@common/utils";
import createHook from "zustand/index";
import create from "zustand/vanilla";

export const pstFileSizeStore = create(() => ({
    fileSizePerLevel: [0],
    totalFileSize: 0,
}));

const { setState } = pstFileSizeStore;

export const setTotalFileSize = (totalFileSize: number): void => {
    const convertedFileSize = bytesToMegabytes(totalFileSize);
    setState({
        fileSizePerLevel: [convertedFileSize],
        totalFileSize: convertedFileSize,
    });
};

/**
 * Consume vanilla attachmentCount store in React scope with a hook.
 * @returns totalFileSize: in Mo
 */
export const usePstFileSizeStore = createHook(pstFileSizeStore);
