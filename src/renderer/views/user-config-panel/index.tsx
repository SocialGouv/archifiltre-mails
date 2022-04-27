import type { ReactNode } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import {
    isUserConfigPanelOpen,
    OnOffUserConfigPanel,
} from "../../store/UserConfigPanelStore";
import style from "./UserConfigPanel.module.scss";

export interface UserConfigPanelProps {
    children: ReactNode;
}

export const UserConfigPanel: React.FC = () => {
    const { t } = useTranslation();

    const selectLang = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const lang = event.target.value;
    };

    if (!isUserConfigPanelOpen()) {
        return null;
    }

    return (
        <div className={style.userconfig}>
            <h1>{t("user-config.panel.title")}</h1>
            <label htmlFor="userconfig__lang__selector">
                {t("user-config.select.choose")}
            </label>

            <select
                onChange={selectLang}
                name="lang"
                id="userconfig__lang__selector"
            >
                <option value={t("user-config.select.french")}>
                    {t("user-config.select.french")}
                </option>
                <option value={t("user-config.select.english")}>
                    {t("user-config.select.english")}
                </option>
                <option value={t("user-config.select.german")}>
                    {t("user-config.select.german")}
                </option>
            </select>
            <button
                className={style.userconfig__close}
                onClick={OnOffUserConfigPanel}
            >
                {t("user-config.panel.close")}
            </button>
        </div>
    );
};
