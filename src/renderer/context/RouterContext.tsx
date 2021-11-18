import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

import type { RouteName } from "../views";

interface RouteContextInterface {
    route: RouteName;
    changeRoute: (nextRoute: RouteName) => void;
}

const initialRouteState: RouteContextInterface = {
    changeRoute: () => "START_SCREEN",
    route: "START_SCREEN",
};

const RouteContext = createContext<RouteContextInterface>(initialRouteState);

const RouteContextProvider: React.FC = ({ children }) => {
    const [route, setRoute] = useState<RouteName>("START_SCREEN");

    const changeRoute = useCallback((nextRoute: RouteName) => {
        setRoute(nextRoute);
    }, []);

    const contextValue = useMemo(
        () => ({
            changeRoute,
            route,
        }),
        [route, changeRoute]
    );

    return (
        <RouteContext.Provider value={contextValue}>
            {children}
        </RouteContext.Provider>
    );
};

/**
 * Simple hook to consume router context easily with only one import and assignment.
 */

export const useRouteContext = (): RouteContextInterface =>
    useContext(RouteContext);

export { RouteContextProvider };
