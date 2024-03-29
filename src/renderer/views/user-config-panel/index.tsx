import type { Locale } from "@common/i18n/raw";
import { useService } from "@common/modules/ContainerModule";
import { schema } from "@common/modules/user-config/schema";
import type { UserConfigTypedKeys } from "@common/modules/user-config/type";
import { Object } from "@common/utils/overload";
import { version } from "@common/utils/package";
import type { ReactNode } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import { useAutoUpdateContext } from "../../context/AutoUpdateContext";
import {
    isUserConfigPanelOpen,
    toggleUserConfigPanel,
} from "../../store/UserConfigPanelStore";
import { Checkbox, Number, Select } from "./inputs";
import style from "./UserConfigPanel.module.scss";

export interface UserConfigPanelProps {
    children: ReactNode;
}

export const UserConfigPanel: React.FC = () => {
    const { t } = useTranslation();
    const userConfigService = useService("userConfigService");
    const { updateInfo, doUpdate } = useAutoUpdateContext();
    if (!isUserConfigPanelOpen()) {
        return null;
    }
    if (!userConfigService) return null;

    const config = userConfigService.getAll();

    return (
        <div className={style.userconfig}>
            <h1>{t("user-config.panel.title")}</h1>
            <div className={style.versionBlock}>
                <span>{t("user-config.version.current", { version })}</span>
                <span
                    className={updateInfo ? style.versionAvailable : ""}
                    aria-hidden
                    onClick={doUpdate}
                >
                    {updateInfo
                        ? t("user-config.version.updateAvailable", updateInfo)
                              .split("")
                              .map((letter, idx) => (
                                  <span key={idx}>{letter}</span>
                              ))
                        : t("user-config.version.noUpdateAvailable")}
                </span>
            </div>
            <hr />

            {Object.keys(schema).map((valueName) => {
                if (valueName === "_firstOpened" || valueName === "viewConfigs")
                    return null;
                const valueSchema = schema[valueName];
                if (valueSchema.enum) {
                    valueSchema.type = "array";
                }

                switch (valueSchema.type) {
                    case "boolean":
                        valueName = valueName as UserConfigTypedKeys<boolean>;
                        return (
                            <Checkbox
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
                            <Number
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

                    case "array":
                        valueName = valueName as UserConfigTypedKeys<Locale>;

                        return (
                            <Select
                                defaultValue={config[valueName]}
                                id={`userconfig__${valueName}`}
                                key={`userconfig__${valueName}`}
                                enumOptions={valueSchema.enum!}
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
                onClick={toggleUserConfigPanel}
            >
                {t("user-config.panel.close")}
            </button>
        </div>
    );
};
