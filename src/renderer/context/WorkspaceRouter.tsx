import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

import { DASHBOARD } from "../../common/constants";

interface WorkspaceRouteContextInterface {
    route: string | null;
    changeWorkspaceRoute: (nextRoute: string) => void;
    backHome: () => void;
}

const initialRouteState: WorkspaceRouteContextInterface = {
    backHome: () => null,
    changeWorkspaceRoute: () => DASHBOARD,
    route: DASHBOARD,
};

const WorkspaceRouteContext =
    createContext<WorkspaceRouteContextInterface>(initialRouteState);

const WorkspaceRouteContextProvider: React.FC = ({ children }) => {
    const [route, setRoute] = useState<string | null>(null);

    const changeWorkspaceRoute = useCallback((nextRoute: string) => {
        setRoute(nextRoute);
    }, []);

    const backHome = useCallback(() => {
        setRoute(null);
    }, []);

    const contextValue = useMemo(
        () => ({
            backHome,
            changeWorkspaceRoute,
            route,
        }),
        [route, changeWorkspaceRoute, backHome]
    );

    return (
        <WorkspaceRouteContext.Provider value={contextValue}>
            {children}
        </WorkspaceRouteContext.Provider>
    );
};

// context consumer hook
export const useWorkspaceRouteContext = (): WorkspaceRouteContextInterface =>
    useContext(WorkspaceRouteContext);

export { WorkspaceRouteContextProvider };
