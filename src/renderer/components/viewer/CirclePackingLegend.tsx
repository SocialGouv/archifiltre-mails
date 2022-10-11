/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import style from "./CirclePacking.module.scss";

export const CirclePackingLegend: React.FC = () => {
    const [isOpen, setIsopen] = useState(false);
    const { t } = useTranslation();
    const toggle = () => {
        setIsopen(!isOpen);
    };

    return (
        <>
            {isOpen && (
                <div className={style.circlePackingLegendOpen} onClick={toggle}>
                    <ul>
                        <div>
                            <li>
                                <small data-name="inside" />
                                {t("dashboard.viewer.legend.untag")}
                            </li>
                            <li>
                                <small data-name="delete" />
                                {t("dashboard.viewer.legend.delete")}
                            </li>
                            <li>
                                <small data-name="keep" />
                                {t("dashboard.viewer.legend.keep")}
                            </li>
                            <li>
                                <small data-name="focus" />
                                {t("dashboard.viewer.legend.selected")}
                            </li>
                        </div>
                        <div>
                            <li>
                                <small data-name="global" />
                                {t("dashboard.viewer.legend.rootElement")}
                            </li>

                            <li>
                                <small data-name="months" />
                                {t("dashboard.viewer.legend.date")}
                            </li>
                            <li>
                                <small data-name="sent" />{" "}
                                {t("dashboard.viewer.legend.sent")}
                            </li>
                        </div>
                    </ul>
                </div>
            )}

            <div className={style.circlePackingLegendSwitcher}>
                <span>{t("dashboard.viewer.legend.switcher")}</span>
                <input
                    id={style.switchInput}
                    type="checkbox"
                    onChange={toggle}
                />
                <label id={style.switchLabel} htmlFor={style.switchInput}>
                    Toggle
                </label>
            </div>
        </>
    );
};
