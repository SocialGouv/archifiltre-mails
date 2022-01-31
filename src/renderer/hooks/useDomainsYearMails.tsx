import type { Any } from "@common/utils/type";
import { useCallback, useEffect, useState } from "react";

import { usePstStore } from "../store/PSTStore";
import { CORRESPONDANTS, DOMAIN, MAILS, YEAR } from "../utils/constants";
import {
    createCorrespondants,
    createDomain,
    createMails,
    createYears,
    findAllMailAddresses,
    findMailsByDomainCorrespondantAndYear,
    findUniqueCorrespondantsByDomain,
    findYearByCorrespondants,
} from "../utils/pst-extractor";

export interface UseDomainsYearMailsProps {
    currentView: Any;
    computeNextView: (data: Any) => void;
    restartView: () => void;
}

export interface InitialViewState {
    elements: Record<string, unknown>;
    type: string;
}

const initialViewState: InitialViewState = { elements: {}, type: "" };

export const useDomainsYearsMails = (): UseDomainsYearMailsProps => {
    const { pstFile, setBreadcrumb } = usePstStore();
    const [currentDomain, setCurrentDomain] = useState("");
    const [currentCorrespondant, setCurrentCorrespondant] = useState("");

    const [currentView, setCurrentView] = useState(initialViewState);
    const [domainView, setDomainView] = useState(initialViewState);

    const createInitialView = useCallback(() => {
        const aggregatedDomainCount = findAllMailAddresses(pstFile!);

        const computedInitialView = {
            elements: createDomain(aggregatedDomainCount, "root"),
            type: DOMAIN,
        };

        setCurrentView(computedInitialView);
        setDomainView(computedInitialView);
    }, [pstFile]);

    const restartView = () => {
        setCurrentView(domainView);
        setBreadcrumb("domaine");
    };

    const _computePreviousView = () => {
        return void 0;
    };

    useEffect(() => {
        createInitialView();
    }, [createInitialView]);

    const computeNextView = (data: Any) => {
        if (currentView.type === DOMAIN) {
            setCurrentDomain(data.data.name as string);
            setBreadcrumb(`${data.data.name} > correspondant`);

            const uniqueCorrespondantsByDomain =
                findUniqueCorrespondantsByDomain(
                    pstFile!,
                    data.data.name as string
                );

            setCurrentView({
                // TODO: Simplifier cette fonction: mettre le type et elements en valeur de retour de createX()
                elements: createCorrespondants(
                    uniqueCorrespondantsByDomain,
                    data.id as string
                ),
                type: CORRESPONDANTS,
            });
        }

        if (currentView.type === CORRESPONDANTS) {
            setCurrentCorrespondant(data.data.name as string);
            setBreadcrumb(`${currentDomain} > ${data.data.name} > années`);

            const _yearByCorrespondants = findYearByCorrespondants(
                pstFile!,
                data.data.name as string
            );

            setCurrentView({
                // TODO: Simplifier cette fonction: mettre le type et elements en valeur de retour de createX()
                elements: createYears(_yearByCorrespondants, data.id as string),
                type: YEAR,
            });
        }

        if (currentView.type === YEAR) {
            setBreadcrumb(
                `${currentDomain} > ${currentCorrespondant} > ${data.data.name} > mails`
            );

            const mailsByYearAndCorrespondant =
                findMailsByDomainCorrespondantAndYear(
                    pstFile!,
                    currentDomain,
                    currentCorrespondant,
                    data.data.name as number
                );

            setCurrentView({
                // TODO: Simplifier cette fonction: mettre le type et elements en valeur de retour de createX()
                elements: createMails(
                    mailsByYearAndCorrespondant,
                    data.id as string
                ),
                type: MAILS,
            });
        }

        return void 0;
    };

    return {
        computeNextView,
        currentView,
        restartView,
    };
};
