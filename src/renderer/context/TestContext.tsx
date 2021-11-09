import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

import { DASHBOARD } from "../utils/constants";

interface PathContextInterface {
    path: string | undefined;
    changePath: (_path: string) => void;
}

const initialPathState: PathContextInterface = {
    changePath: () => null,
    path: DASHBOARD,
};

const PathContext = createContext<PathContextInterface>(initialPathState);

const PathContextProvider: React.FC = ({ children }) => {
    const [path, setPath] = useState<string | undefined>(undefined);

    const changePath = useCallback((_path: string | undefined) => {
        setPath(_path);
    }, []);

    const contextValue = useMemo(
        () => ({
            changePath,
            path,
        }),
        [path, changePath]
    );

    return (
        <PathContext.Provider value={contextValue}>
            {children}
        </PathContext.Provider>
    );
};

// context consumer hook
export const usePathContext = (): PathContextInterface =>
    useContext(PathContext);

export { PathContextProvider };
