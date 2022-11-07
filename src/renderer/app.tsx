import "react-toastify/dist/ReactToastify.css";
import "normalize.css/normalize.css";
import "./styles/global.scss";

import React from "react";
import { ToastContainer } from "react-toastify";

import { AutoUpdateProvider } from "./context/AutoUpdateContext";
import { RouteContextProvider } from "./context/RouterContext";
import { Views } from "./views";

export const App: React.FC = () => (
    <main>
        <AutoUpdateProvider>
            <RouteContextProvider>
                <ToastContainer />
                <Views />
            </RouteContextProvider>
        </AutoUpdateProvider>
    </main>
);
