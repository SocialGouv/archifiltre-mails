import React from "react";

import style from "./Logo.module.scss";

export const Logo: React.FC = () => {
    return (
        <div id={style.logo}>
            <h1 className={style.logo__title}>
                <button>A</button>
            </h1>
        </div>
    );
};
