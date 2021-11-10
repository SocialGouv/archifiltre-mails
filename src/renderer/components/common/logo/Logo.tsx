import React from "react";

import style from "./Logo.module.scss";

export const Logo: React.FC = () => {
    return (
        <h1 id={style.logo}>
            <button>archimail</button>
        </h1>
    );
};
