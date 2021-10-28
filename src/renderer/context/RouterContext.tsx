import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

import { DASHBOARD } from "../utils/constants";

interface RouteContextInterface {
    route: string;
    changeRoute: (nextRoute: string) => void;
}

const initialRouteState: RouteContextInterface = {
    changeRoute: () => DASHBOARD,
    route: DASHBOARD,
};

const RouteContext = createContext<RouteContextInterface>(initialRouteState);

const RouteContextProvider: React.FC = ({ children }) => {
    const [route, setRoute] = useState(DASHBOARD);

    const changeRoute = useCallback((nextRoute: string) => {
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

// context consumer hook
export const useRouteContext = (): RouteContextInterface =>
    useContext(RouteContext);

export { RouteContextProvider };
