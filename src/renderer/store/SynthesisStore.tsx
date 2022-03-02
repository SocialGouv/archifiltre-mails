import type React from "react";
import createHook from "zustand/index";
import create from "zustand/vanilla";

import type { OwnerFinderBoardProps } from "../components/owner-finder/OwnerFinderBoard";

export const synthesisStore = create(() => ({
    deletedFolderId: "",
    deletedFolderName: "",
    deletedMail: 0,
    ownerId: "",
    ownerName: "",
    receivedMail: 0,
    sentMail: 0,
}));

const { setState } = synthesisStore;

export const setMailBoxOwner = (ownerName: string): void => {
    setState({ ownerName });
};

export const setDeletedFolder = (deletedFolderName: string): void => {
    setState({ deletedFolderName });
};

export const setMailBoxOwnerId = (ownerId: string): void => {
    setState({ ownerId });
};

export const setDeletedFolderId = (deletedFolderId: string): void => {
    setState({ deletedFolderId });
};

export const synthesisIdHandler = (
    event: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
    type: OwnerFinderBoardProps["type"]
): void => {
    const target = event.target as HTMLElement;
    const handler = type === "deleted" ? setDeletedFolderId : setMailBoxOwnerId;

    handler(target.id);
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
