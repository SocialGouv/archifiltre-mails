import create from "zustand";

export const userConfigPanelStore = create(() => ({
    isOpen: true,
}));

const { setState, getState } = userConfigPanelStore;

export const OnOffUserConfigPanel = (): void => {
    setState((state) => ({ isOpen: !state.isOpen }));
};

export const isUserConfigPanelOpen = (): boolean =>
    userConfigPanelStore().isOpen;
