import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

interface PathContextInterface {
    path: string | undefined;
    changePath: (loadedPath: string) => void;
}

const initialPathState: PathContextInterface = {
    changePath: () => "",
    path: undefined,
};

// TODO: Maybe change the name depends on the next features...
const PathContext = createContext<PathContextInterface>(initialPathState);

const PathContextProvider: React.FC = ({ children }) => {
    const [path, setPath] = useState<string | undefined>(undefined);

    const changePath = useCallback((loadedPath: string | undefined) => {
        setPath(loadedPath);
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

/**
 * Simple hook to consume path context easily with only one import and assignment.
 */

export const usePathContext = (): PathContextInterface =>
    useContext(PathContext);

export { PathContextProvider };
