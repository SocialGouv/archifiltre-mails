import type { Locale } from "@common/i18n/raw";
import { SupportedLocales } from "@common/i18n/raw";
import { useService } from "@common/modules/ContainerModule";
import { schema } from "@common/modules/user-config/schema";
import type {
    UserConfigTypedKeys,
    WritableUserConfigKeys,
} from "@common/modules/user-config/type";
import { Object } from "@common/utils/overload";
import type { ReactNode } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import {
    isUserConfigPanelOpen,
    OnOffUserConfigPanel,
} from "../../store/UserConfigPanelStore";
import style from "./UserConfigPanel.module.scss";
import { UserConfigPanelCheckbox } from "./UserConfigPanelCheckbox";
import { UserConfigPanelNumber } from "./UserConfigPanelNumber";
import { UserConfigPanelSelect } from "./UserConfigPanelSelect";

export interface UserConfigPanelProps {
    children: ReactNode;
}

type ReactChangeEvent<TElement> = React.ChangeEvent<TElement>;

export interface UserConfigPanelBaseProps<TElement> {
    id: string;
    label: string;
    setter: (event: ReactChangeEvent<TElement>) => void;
}

export const UserConfigPanel: React.FC = () => {
    const { t } = useTranslation();
    const userConfigService = useService("userConfigService");
    if (!isUserConfigPanelOpen()) {
        return null;
    }
    if (!userConfigService) return null;

    const config = userConfigService.getAll();

    const selectLocale = (event: ReactChangeEvent<HTMLSelectElement>) => {
        const lang = event.target.value;
        userConfigService.set("locale", lang as Locale);
    };

    const localeOptions = SupportedLocales.map((local) => ({
        label: local,
        value: local,
    }));

    const switcher = (
        event: ReactChangeEvent<HTMLInputElement>,
        service: WritableUserConfigKeys
    ) => {
        const checked = event.target.checked;
        userConfigService.set(service, checked);
    };

    const switcherNumber = (event: ReactChangeEvent<HTMLInputElement>) => {
        const extractProgressDelay = +event.target.value;
        userConfigService.set("extractProgressDelay", extractProgressDelay);
    };

    return (
        <div className={style.userconfig}>
            <h1>{t("user-config.panel.title")}</h1>

            {Object.keys(schema).map((valueName) => {
                const valueSchema = schema[valueName];
                switch (valueSchema.type) {
                    case "boolean":
                        valueName = valueName as UserConfigTypedKeys<boolean>;
                        return (
                            <UserConfigPanelCheckbox
                                checked={config[valueName]}
                                id={`userconfig__${valueName}`}
                                key={`userconfig__${valueName}`}
                                label={t(`user-config.input.${valueName}`)}
                                setter={(event) => {
                                    userConfigService.set(
                                        valueName,
                                        event.target.checked
                                    );
                                }}
                            />
                        );
                    default:
                        return null;
                }
            })}

            <UserConfigPanelSelect
                defaultValue={config.locale}
                id="userconfig__lang__selector"
                options={localeOptions}
                label={t("user-config.select.choose")}
                setter={selectLocale}
            />
            <UserConfigPanelNumber
                id="userconfig__progress"
                label={t("user-config.input.progress")}
                currentValue={config.extractProgressDelay}
                setter={switcherNumber}
            />
            <UserConfigPanelCheckbox
                checked={config.fullscreen}
                id="userconfig__fullscreen"
                label={t("user-config.input.fullscreen")}
                setter={(event) => {
                    switcher(event, "fullscreen");
                }}
            />
            <UserConfigPanelCheckbox
                checked={config.fullscreen}
                id="userconfig__collect"
                label={t("user-config.input.collectData")}
                setter={(event) => {
                    switcher(event, "collectData");
                }}
            />

            <button
                className={style.userconfig__close}
                onClick={OnOffUserConfigPanel}
            >
                {t("user-config.panel.close")}
            </button>
        </div>
    );
};
