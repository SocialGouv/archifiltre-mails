import { PRODUCT_CHANNEL } from "@common/config";
import type { HTMLAttributes } from "react";
import React from "react";

import { StaticImage } from "../staticImage/StaticImage";
import style from "./Logo.module.scss";

export const Logo: React.FC<HTMLAttributes<HTMLDivElement>> = (props) => {
    return (
        <div {...props}>
            {PRODUCT_CHANNEL !== "stable" && (
                <div className={style.channel}>{PRODUCT_CHANNEL}</div>
            )}
            <StaticImage className={style.logo} alt="logo" src="img/logo.png" />
        </div>
    );
};
