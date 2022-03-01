import createHook from "zustand/index";
import create from "zustand/vanilla";

export const synthesisStore = create(() => ({
    deletedMail: 0,
    receivedMail: 0,
    sentMail: 0,
}));

const { setState } = synthesisStore;

/**
 * Consume vanilla attachmentCount store in React scope with a hook.
 */
export const useSynthesisStore = createHook(synthesisStore);
