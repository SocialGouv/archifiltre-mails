import type { Locale } from "@common/i18n/raw";
import { useService } from "@common/modules/ContainerModule";
import type { UserConfigObject } from "@common/modules/UserConfigModule";
import { Object } from "@common/utils/overload";
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

interface CommonConfigComponentProps {
    value: any;
}
const configComponents = {
    bigint: ({ value }: CommonConfigComponentProps) => <></>,
    boolean: ({ value }: CommonConfigComponentProps) => (
        <input type="checkbox" value={value} />
    ),
    function: ({ value }: CommonConfigComponentProps) => <></>,
    number: ({ value }: CommonConfigComponentProps) => <></>,
    object: ({ value }: CommonConfigComponentProps) => <></>,
    string: ({ value }: CommonConfigComponentProps) => (
        <input type="text" value={value} />
    ),
    symbol: ({ value }: CommonConfigComponentProps) => <></>,
    undefined: ({ value }: CommonConfigComponentProps) => <></>,
};

const userConfigTemplate: UserConfigObject = {
    _firstOpened: true,
    appId: "",
    collectData: true,
    extractProgressDelay: 0,
    fullscreen: true,
    locale: "fr-FR",
};

export const UserConfigPanel: React.FC = () => {
    const { t } = useTranslation();
    const userConfigService = useService("userConfigService");
    if (!isUserConfigPanelOpen()) {
        return null;
    }
    if (!userConfigService) return null;

    const config = userConfigService.getAll();

    const selectLang = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const lang = event.target.value;
        userConfigService.set("locale", lang as Locale);
    };

    return (
        <div className={style.userconfig}>
            {Object.keys(userConfigTemplate).map((k) => {
                const type = typeof userConfigTemplate[k];
                return configComponents[type]({ value });
            })}
            <h1>{t("user-config.panel.title")}</h1>
            <label htmlFor="userconfig__lang__selector">
                {t("user-config.select.choose")}
            </label>

            <select
                onChange={selectLang}
                name="lang"
                id="userconfig__lang__selector"
                defaultValue={config.locale}
            >
                <option value="fr-FR">{t("user-config.select.french")}</option>
                <option value="en-GB">{t("user-config.select.english")}</option>
                <option value="de-DE">{t("user-config.select.german")}</option>
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
