/* eslint-disable @typescript-eslint/naming-convention */
import React from "react";

import { usePstStore } from "../../store/PSTStore";
import {
    MAX_TRESHOLD,
    ORG_UNIT_PST,
    RATIO_FROM_MAX,
} from "../../utils/constants";
import { findAllMailAddresses, getDomain } from "../../utils/pst-extractor";
import style from "./CirclePacking.module.scss";
import { CirclePackingViewer } from "./CirclePackingViewer";

export const CirclePacking: React.FC = () => {
    const { pstFile } = usePstStore();
    const { updateComputedPst, setDepth } = usePstStore();

    const restartViewer = () => {
        if (pstFile) {
            updateComputedPst(pstFile, "root");
            setDepth(1);
        }
    };

    if (pstFile) {
        const uniqueAddresses = [...new Set(findAllMailAddresses(pstFile))];

        // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
        const domains = uniqueAddresses
            .map((element) => {
                if (element.includes(ORG_UNIT_PST)) {
                    // TODO: handle "/DC"
                    return "Same LDAP";
                }
                if (element.indexOf("@")) {
                    return getDomain(element);
                }
            })
            .sort();

        const duplicatedDomainsCount = (
            domains.filter(Boolean) as string[]
        ).reduce<Record<string, number>>(
            (acc, value) => ({
                ...acc,
                [value]: (acc[value] ?? 0) + 1,
            }),
            {}
        );

        const maxMail = Object.values(duplicatedDomainsCount).reduce(
            (acc, cur) => Math.max(acc, cur),
            0
        );

        const treshold = Math.min(
            Math.ceil(maxMail * (RATIO_FROM_MAX / 100)),
            MAX_TRESHOLD
        );

        const aggregatedDomainCount = Object.entries(
            duplicatedDomainsCount
        ).reduce<Record<string, number>>(
            (acc, [email, count]) => {
                if (count > treshold) {
                    acc[email] = count;
                } else acc.__others += count;
                return acc;
            },
            { __others: 0 }
        );
    }

    return (
        <div id="circle-packing" className={style["circle-packing"]}>
            <button onClick={restartViewer}>Restart</button>
            <CirclePackingViewer pstFile={pstFile} />
        </div>
    );
};
