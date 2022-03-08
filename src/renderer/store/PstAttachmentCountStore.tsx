import createHook from "zustand/index";
import create from "zustand/vanilla";

export const attachmentCountStore = create(() => ({
    attachmentPerLevel: [0],
    totalAttachment: 0,
}));

const { setState } = attachmentCountStore;

export const setTotalAttachment = (totalAttachment: number): void => {
    setState({
        attachmentPerLevel: [totalAttachment],
        totalAttachment,
    });
};

export const setAttachmentPerLevel = (newAttachmentPerLevel: number): void => {
    setState(({ attachmentPerLevel }) => ({
        attachmentPerLevel: [...attachmentPerLevel, newAttachmentPerLevel],
    }));
};

export const setPreviousAttachmentPerLevel = (): void => {
    setState(({ attachmentPerLevel: attachmentPerLevel }) => {
        if (attachmentPerLevel.length === 1)
            return {
                attachmentPerLevel: [attachmentPerLevel[0] ?? 0],
            };

        const previousAttachmentPerLevel = attachmentPerLevel;
        previousAttachmentPerLevel.pop();

        return {
            attachmentPerLevel: previousAttachmentPerLevel,
        };
    });
};

export const setInitialAttachmentPerLevel = (): void => {
    setState(({ attachmentPerLevel }) => ({
        attachmentPerLevel: [attachmentPerLevel[0] ?? 0],
    }));
};
/**
 * Consume vanilla attachmentCount store in React scope with a hook.
 */
export const useAttachmentCountStore = createHook(attachmentCountStore);
