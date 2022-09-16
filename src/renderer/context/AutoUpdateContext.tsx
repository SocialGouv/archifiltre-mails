import { ipcRenderer } from "@common/lib/ipc";
import type { UpdateInfo } from "electron-updater";
import { noop } from "lodash";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { useTranslation } from "react-i18next";

interface AutoUpdateContextProps {
    checkForUpdate: () => void;
    doUpdate: () => boolean;
    error?: string;
    updateInfo: UpdateInfo | false;
}

const AutoUpdateContext = createContext<AutoUpdateContextProps>({
    checkForUpdate: noop,
    doUpdate: () => false,
    updateInfo: false,
});

export const useAutoUpdateContext = (): AutoUpdateContextProps => {
    return useContext(AutoUpdateContext);
};

export const AutoUpdateProvider: React.FC = ({ children }) => {
    const [updateInfo, setUpdateInfo] =
        useState<AutoUpdateContextProps["updateInfo"]>(false);
    const [error, setError] = useState<string>();
    const { t } = useTranslation();
    const checkForUpdate = useCallback(() => {
        ipcRenderer.send("autoUpdate.check");
    }, []);
    const doUpdate = useCallback(
        () => ipcRenderer.sendSync("autoUpdate.doUpdate"),
        []
    );

    useEffect(() => {
        ipcRenderer.on("autoUpdate.onUpdateAvailable", (_, info) => {
            setUpdateInfo(info);
        });
        ipcRenderer.on("autoUpdate.onError", (_, err) => {
            setError(err);
        });

        checkForUpdate();
        return () => {
            ipcRenderer.removeAllListeners("autoUpdate.onUpdateAvailable");
            ipcRenderer.removeAllListeners("autoUpdate.onError");
        };
    }, [checkForUpdate, doUpdate, t]);

    return (
        <AutoUpdateContext.Provider
            value={{ checkForUpdate, doUpdate, error, updateInfo }}
        >
            {children}
        </AutoUpdateContext.Provider>
    );
};
