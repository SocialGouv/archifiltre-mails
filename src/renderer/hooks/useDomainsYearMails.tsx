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

export const useDomainsYearsMails = (): UseDomainsYearMailsProps => {
    const { pstFile, setBreadcrumb } = usePstStore();
    const [currentDomain, setCurrentDomain] = useState("");
    const [currentCorrespondant, setCurrentCorrespondant] = useState("");
    const [currentView, setCurrentView] = useState({ elements: {}, type: "" });

    const [domainView, setDomainView] = useState<Any>(undefined);

    const createInitialView = useCallback(() => {
        const aggregatedDomainCount = findAllMailAddresses(pstFile!);

        const initialView = {
            elements: createDomain(aggregatedDomainCount, "root"),
            type: DOMAIN,
        };

        setCurrentView(initialView);
        setDomainView(initialView);
    }, [pstFile]);

    const restartView = () => {
        setCurrentView(domainView);
        setBreadcrumb("archive");
    };

    useEffect(() => {
        createInitialView();
    }, [createInitialView]);

    const computeNextView = (data: Any) => {
        if (currentView.type === DOMAIN) {
            setCurrentDomain(data.data.name as string);
            setBreadcrumb("archive > domaine");

            const uniqueCorrespondantsByDomain =
                findUniqueCorrespondantsByDomain(
                    pstFile!,
                    data.data.name as string
                );

            setCurrentView({
                elements: createCorrespondants(
                    uniqueCorrespondantsByDomain,
                    data.id as string
                ),
                type: CORRESPONDANTS,
            });
        }

        if (currentView.type === CORRESPONDANTS) {
            setCurrentCorrespondant(data.data.name as string);
            setBreadcrumb("archive > domaine > correspondant");

            const _yearByCorrespondants = findYearByCorrespondants(
                pstFile!,
                data.data.name as string
            );

            setCurrentView({
                elements: createYears(_yearByCorrespondants, data.id as string),
                type: YEAR,
            });
        }

        if (currentView.type === YEAR) {
            setBreadcrumb("archive > domaine > correspondant > mails");

            const mailsByYearAndCorrespondant =
                findMailsByDomainCorrespondantAndYear(
                    pstFile!,
                    currentDomain,
                    currentCorrespondant,
                    data.data.name as number
                );

            setCurrentView({
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
