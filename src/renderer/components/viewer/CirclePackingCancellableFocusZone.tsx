/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React from "react";

import { usePstStore } from "../../store/PSTStore";
import style from "./CirclePacking.module.scss";

export const CirclePackingCancellableFocusZone: React.FC = () => {
    const { isInfoFocus, cancelFocus } = usePstStore();

    if (!isInfoFocus) return null;

    return (
        <div
            className={style.circlePackingCancellableZone}
            onClick={cancelFocus}
        />
    );
};