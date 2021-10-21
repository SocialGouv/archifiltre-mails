import React from "react";

import { DASHBOARD } from "../../../../common/constants";
import { useRouteContext } from "../../../context/RouterContext";
import style from "./Logo.module.scss";

export const Logo: React.FC = () => {
    const { changeRoute } = useRouteContext();

    const backToHome = () => {
        changeRoute(DASHBOARD);
    };

    return (
        <h1 id={style.logo}>
            <button onClick={backToHome}>archimail</button>
        </h1>
    );
};
