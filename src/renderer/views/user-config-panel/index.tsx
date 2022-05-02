import type { Locale } from "@common/i18n/raw";
import { SupportedLocales } from "@common/i18n/raw";
import { useService } from "@common/modules/ContainerModule";
import { schema } from "@common/modules/user-config/schema";
import type { UserConfigTypedKeys } from "@common/modules/user-config/type";
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

    const localeOptions = SupportedLocales.map((local) => ({
        label: local,
        value: local,
    }));

    return (
        <div className={style.userconfig}>
            <h1>{t("user-config.panel.title")}</h1>

            {Object.keys(schema).map((valueName) => {
                const valueSchema = schema[valueName];
                switch (valueSchema.type) {
                    case "boolean":
                        if (valueName === "_firstOpened") return null;
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

                    case "integer":
                        valueName = valueName as UserConfigTypedKeys<number>;
                        return (
                            <UserConfigPanelNumber
                                id={`userconfig__${valueName}`}
                                label={t("user-config.input.progress")}
                                currentValue={config[valueName]}
                                key={`userconfig__${valueName}`}
                                setter={(event) => {
                                    userConfigService.set(
                                        valueName,
                                        +event.target.value
                                    );
                                }}
                            />
                        );

                    case undefined:
                        valueName = valueName as UserConfigTypedKeys<Locale>;

                        return (
                            <UserConfigPanelSelect
                                defaultValue={config[valueName]}
                                id={`userconfig__${valueName}`}
                                options={localeOptions}
                                label={t("user-config.select.choose")}
                                setter={(event) => {
                                    userConfigService.set(
                                        valueName,
                                        event.target.value
                                    );
                                }}
                            />
                        );

                    default:
                        return null;
                }
            })}

            <button
                className={style.userconfig__close}
                onClick={OnOffUserConfigPanel}
            >
                {t("user-config.panel.close")}
            </button>
        </div>
    );
};
