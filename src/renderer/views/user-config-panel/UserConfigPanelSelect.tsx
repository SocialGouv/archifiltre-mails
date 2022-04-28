import React from "react";

import type { UserConfigPanelBaseProps } from ".";
import style from "./UserConfigPanel.module.scss";

interface UserConfigPanelSelectOptions {
    label: number | string;
    value: number | string;
}

interface UserConfigPanelSelectProps
    extends UserConfigPanelBaseProps<HTMLSelectElement> {
    defaultValue: number | string;
    options: UserConfigPanelSelectOptions[];
}

export const UserConfigPanelSelect: React.FC<UserConfigPanelSelectProps> = ({
    setter,
    defaultValue,
    options,
    id,
    label,
}) => (
    <div className={style.userconfig__controller}>
        <label htmlFor={id}>{label}</label>

        <select onChange={setter} id={id} defaultValue={defaultValue}>
            {options.map((option, index) => (
                <option value={option.value} key={index}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);
