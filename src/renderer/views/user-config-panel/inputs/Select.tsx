import React from "react";

import type { UserConfigPanelBaseProps } from "../type";
import style from "../UserConfigPanel.module.scss";

interface SelectOption {
    label: number | string;
    value: number | string;
}

interface SelectProps extends UserConfigPanelBaseProps<HTMLSelectElement> {
    defaultValue: number | string;
    enumOptions: string[];
}

const enumToOptions = (anyEnum: string[]): SelectOption[] =>
    anyEnum.map((local) => ({
        label: local,
        value: local,
    }));

export const Select: React.FC<SelectProps> = ({
    setter,
    defaultValue,
    enumOptions,
    id,
    label,
}) => (
    <div className={style.userconfig__controller}>
        <label htmlFor={id}>{label}</label>

        <select onChange={setter} id={id} defaultValue={defaultValue}>
            {enumToOptions(enumOptions).map((option, index) => (
                <option value={option.value} key={index}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);
