import createHook from "zustand/index";
import create from "zustand/vanilla";

export const mailCountStore = create(() => ({
    totalMail: 0,
    totalMailPerLevel: [0],
}));

const { setState } = mailCountStore;

export const setTotalMail = (totalMail: number): void => {
    setState({ totalMail, totalMailPerLevel: [totalMail] });
};

export const setTotalMailPerLevel = (newTotalMailPerLevel: number): void => {
    setState(({ totalMailPerLevel }) => ({
        totalMailPerLevel: [...totalMailPerLevel, newTotalMailPerLevel],
    }));
};

export const setPreviousTotalMailsPerLevel = (): void => {
    setState(({ totalMailPerLevel }) => {
        if (totalMailPerLevel.length === 1)
            return {
                totalMailPerLevel: [totalMailPerLevel[0] ?? 0],
            };

        const previoustotalMailPerLevel = totalMailPerLevel;
        previoustotalMailPerLevel.pop();

        return {
            totalMailPerLevel: previoustotalMailPerLevel,
        };
    });
};

export const setInitialTotalMailPerLevelCount = (): void => {
    setState(({ totalMailPerLevel }) => ({
        totalMailPerLevel: [totalMailPerLevel[0] ?? 0],
    }));
};

/**
 * Consume vanilla attachmentCount store in React scope with a hook.
 */
export const useMailCountStore = createHook(mailCountStore);
