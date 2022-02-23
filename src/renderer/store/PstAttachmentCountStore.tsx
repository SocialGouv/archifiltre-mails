import createHook from "zustand/index";
import create from "zustand/vanilla";

export const attachmentCountStore = create(() => ({
    attachmentPerLevelCount: [0],
    attachmentTotalCount: 0,
}));

const { setState } = attachmentCountStore;

export const setAttachmentTotalCount = (attachmentTotalCount: number): void => {
    setState({
        attachmentPerLevelCount: [attachmentTotalCount],
        attachmentTotalCount,
    });
};

export const setAttachmentPerLevelCount = (
    newAttachmentPerLevelCount: number
): void => {
    setState(({ attachmentPerLevelCount }) => ({
        attachmentPerLevelCount: [
            ...attachmentPerLevelCount,
            newAttachmentPerLevelCount,
        ],
    }));
};

export const setPreviousAttachmentPerLevelCount = (): void => {
    setState(({ attachmentPerLevelCount }) => {
        if (attachmentPerLevelCount.length === 1)
            return {
                attachmentPerLevelCount: [attachmentPerLevelCount[0] ?? 0],
            };

        const previousAttachmentPerLevelCount = attachmentPerLevelCount;
        previousAttachmentPerLevelCount.pop();

        return {
            attachmentPerLevelCount: previousAttachmentPerLevelCount,
        };
    });
};

export const setInitialAttachmentPerLevelCount = (): void => {
    setState(({ attachmentPerLevelCount }) => ({
        attachmentPerLevelCount: [attachmentPerLevelCount[0] ?? 0],
    }));
};
/**
 * Consume vanilla attachmentCount store in React scope with a hook.
 */
export const useAttachmentCountStore = createHook(attachmentCountStore);
