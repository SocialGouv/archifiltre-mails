import React from "react";

import type { UserConfigPanelBaseProps } from ".";
import style from "./UserConfigPanel.module.scss";

interface UserConfigPanelCheckboxProps
    extends UserConfigPanelBaseProps<HTMLInputElement> {
    checked: boolean;
}

export const UserConfigPanelCheckbox: React.FC<
    UserConfigPanelCheckboxProps
> = ({ setter, id, label, checked }) => (
    <div className={style.userconfig__controller}>
        <div className={style.userconfig__toggle}>
            <label>{label}</label>
            <input
                onChange={setter}
                type="checkbox"
                name={id}
                className={style.userconfig__toggle__input}
                id={id}
                checked={checked}
            />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor={id} />
        </div>
    </div>
);
