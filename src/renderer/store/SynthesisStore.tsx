import createHook from "zustand/index";
import create from "zustand/vanilla";

export const synthesisStore = create(() => ({
    deletedMail: 0,
    owner: "",
    receivedMail: 0,
    sentMail: 0,
}));

const { setState } = synthesisStore;

export const setMailBoxOwner = (owner: string): void => {
    setState({ owner });
};

/**
 * Consume vanilla attachmentCount store in React scope with a hook.
 */
export const useSynthesisStore = createHook(synthesisStore);
