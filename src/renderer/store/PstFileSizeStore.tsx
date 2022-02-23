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

export const setFileSizePerLevel = (fileSize: number): void => {
    setState(({ fileSizePerLevel }) => ({
        fileSizePerLevel: [...fileSizePerLevel, bytesToMegabytes(fileSize)],
    }));
};

export const setPreviousFileSizePerLevel = (): void => {
    setState(({ fileSizePerLevel }) => {
        if (fileSizePerLevel.length === 1)
            return {
                fileSizePerLevel: [fileSizePerLevel[0] ?? 0],
            };

        const previousfileSizePerLevel = fileSizePerLevel;
        previousfileSizePerLevel.pop();

        return {
            fileSizePerLevel: previousfileSizePerLevel,
        };
    });
};

export const setInitialFileSizePerLevel = (): void => {
    setState(({ fileSizePerLevel }) => ({
        fileSizePerLevel: [fileSizePerLevel[0] ?? 0],
    }));
};

/**
 * Consume vanilla attachmentCount store in React scope with a hook.
 */
export const usePstFileSizeStore = createHook(pstFileSizeStore);
