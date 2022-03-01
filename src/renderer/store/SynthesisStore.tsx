import type React from "react";
import createHook from "zustand/index";
import create from "zustand/vanilla";

import type { OwnerFinderBoardProps } from "../components/owner-finder/OwnerFinderBoard";

export const synthesisStore = create(() => ({
    deletedFolder: "",
    deletedMail: 0,
    owner: "",
    receivedMail: 0,
    sentMail: 0,
}));

const { setState } = synthesisStore;

export const setMailBoxOwner = (owner: string): void => {
    setState({ owner });
};

export const setDeletedFolder = (deletedFolder: string): void => {
    setState({ deletedFolder });
};

export const synthesisInputHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: OwnerFinderBoardProps["type"]
): void => {
    const handler = type === "deleted" ? setDeletedFolder : setMailBoxOwner;
    handler(event.target.value.toLowerCase());
};

/**
 * Consume vanilla attachmentCount store in React scope with a hook.
 */
export const useSynthesisStore = createHook(synthesisStore);
