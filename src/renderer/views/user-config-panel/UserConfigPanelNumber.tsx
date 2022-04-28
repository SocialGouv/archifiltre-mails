import type { ReactNode } from "react";
import React from "react";

import type { UserConfigPanelBaseProps } from ".";
import style from "./UserConfigPanel.module.scss";

interface UserConfigPanelNumberProps
    extends UserConfigPanelBaseProps<HTMLInputElement> {
    currentValue: number;
}

export const UserConfigPanelNumber = ({
    setter,
    id,
    label,
    currentValue,
}: UserConfigPanelNumberProps): ReactNode => (
    <div className={style.userconfig__controller}>
        <div className={style.userconfig__number}>
            <label htmlFor={id}>{label}</label>

            <input
                onChange={setter}
                type="number"
                max={30000}
                min={500}
                step={50}
                name={id}
                defaultValue={currentValue}
                className={style.userconfig__number}
                id={id}
            />
        </div>
    </div>
);
