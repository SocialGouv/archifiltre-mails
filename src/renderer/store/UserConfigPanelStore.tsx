import create from "zustand";

export const userConfigPanelStore = create(() => ({
    isOpen: false,
}));

const { setState } = userConfigPanelStore;

export const toggleUserConfigPanel = (): void => {
    setState((state) => ({ isOpen: !state.isOpen }));
};

export const isUserConfigPanelOpen = (): boolean =>
    userConfigPanelStore().isOpen;
