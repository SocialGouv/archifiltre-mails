/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React from "react";

import { usePstFMInfosStore } from "../../store/PstFMInfosStore";
import style from "./CirclePacking.module.scss";

export interface OnBlur {
    onBlur?: (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export const CirclePackingCancellableFocusZone: React.FC<OnBlur> = ({
    onBlur,
}) => {
    const { isInfoFocus, cancelFocus } = usePstFMInfosStore();

    if (!isInfoFocus) return null;

    return (
        <div
            className={style.circlePackingCancellableZone}
            onClick={(evt) => {
                cancelFocus();
                onBlur?.(evt);
            }}
        />
    );
};
