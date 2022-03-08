import { useService } from "@common/modules/ContainerModule";
import type { ComputedDatum } from "@nivo/circle-packing/dist/types/types";
import { useCallback, useEffect, useState } from "react";

import { useBreadcrumbStore } from "../store/BreadcrumbStore";
import {
    setInitialAttachmentPerLevel,
    setPreviousAttachmentPerLevel,
} from "../store/PstAttachmentCountStore";
import {
    setInitialFileSizePerLevel,
    setPreviousFileSizePerLevel,
} from "../store/PstFileSizeStore";
import { usePstFMInfosStore } from "../store/PstFMInfosStore";
import {
    setInitialTotalMailPerLevel,
    setPreviousTotalMailsPerLevel,
    setTotalMailPerLevel,
} from "../store/PstMailCountStore";
import { usePstStore } from "../store/PSTStore";
import { CORRESPONDANTS, DOMAIN, MAILS, YEAR } from "../utils/constants";
import type {
    DefaultViewerObject,
    DomainViewerObject,
} from "../utils/dashboard-viewer-dym";
import {
    createCorrespondants,
    createDomain,
    createMails,
    createYears,
    getAggregatedDomains,
    getMailsByDym,
    getTotalLevelMail,
    getUniqueCorrespondantsByDomain,
    getYearByCorrespondants,
} from "../utils/dashboard-viewer-dym";

export interface UseDomainsYearMailsProps {
    computeNextView: (node: ComputedDatum<DefaultViewerObject<string>>) => void;
    computePreviousView: () => void;
    currentView?: ViewState<DefaultViewerObject<string>>;
    restartView: () => void;
}

export type ViewType =
    | typeof CORRESPONDANTS
    | typeof DOMAIN
    | typeof MAILS
    | typeof YEAR;

export interface ViewState<TElement> {
    elements: TElement;
    type: ViewType;
}

/**
 * A hook to manage the domain-year-mails vizualisation.
 *
 * DYM accronym of Domain Year Mails.
 * - Compute all next view following the current one.
 * - Allow breadcrumb dynamic display.
 * - Allow user to restart the view.
 * - Allow user to go back in the previous view
 */
export const useDymViewerNavigation = (): UseDomainsYearMailsProps => {
    const { pstFile } = usePstStore();
    const { setBreadcrumb, setPreviousBreadcrumb } = useBreadcrumbStore();
    const { cancelFocus } = usePstFMInfosStore();
    const [currentDomain, setCurrentDomain] = useState<string>("");
    const [currentCorrespondant, setCurrentCorrespondant] =
        useState<string>("");

    const [currentView, setCurrentView] =
        useState<ViewState<DefaultViewerObject<string>>>();

    const [domainView, setDomainView] =
        useState<ViewState<DomainViewerObject>>();

    const [correspondantView, setCorrespondantView] =
        useState<ViewState<DefaultViewerObject<string>>>();

    const [yearView, setYearView] =
        useState<ViewState<DefaultViewerObject<string>>>();

    console.log(`IN useDymViewerNavigation`);
    const trackerService = useService("trackerService");

    const createInitialView = useCallback(() => {
        const aggregatedDomain = getAggregatedDomains(pstFile!);

        const computedInitialView = {
            elements: createDomain(aggregatedDomain),
            type: DOMAIN as ViewType,
        };

        setCurrentView(computedInitialView);
        setDomainView(computedInitialView);
    }, [pstFile]);

    useEffect(() => {
        createInitialView();
    }, [createInitialView]);

    const restartView = () => {
        setCurrentView(domainView);
        cancelFocus();
        setInitialAttachmentPerLevel();
        setInitialTotalMailPerLevel();
        setInitialFileSizePerLevel();
        setBreadcrumb({ id: "domain" });
    };

    const computePreviousView = () => {
        cancelFocus();
        setPreviousAttachmentPerLevel();
        setPreviousTotalMailsPerLevel();
        setPreviousFileSizePerLevel();

        if (currentView?.type === CORRESPONDANTS) {
            setCurrentView(domainView);
            setPreviousBreadcrumb("domain");
        }
        if (currentView?.type === YEAR) {
            setCurrentView(correspondantView);
            setPreviousBreadcrumb("correspondant");
        }

        if (currentView?.type === MAILS) {
            setCurrentView(yearView);
            setPreviousBreadcrumb("year");
        }

        return;
    };

    const computeNextView = (
        node: ComputedDatum<DefaultViewerObject<string>>
    ) => {
        if (currentView?.type === DOMAIN) {
            setCurrentDomain(node.data.name);
            setBreadcrumb({
                history: [node.data.name],
                id: "correspondant",
            });

            const uniqueCorrespondantsByDomain =
                getUniqueCorrespondantsByDomain(pstFile!, node.data.name);

            const elements = createCorrespondants(
                uniqueCorrespondantsByDomain,
                node.id
            );

            const totalLevelMails = getTotalLevelMail(elements);
            setTotalMailPerLevel(totalLevelMails);

            setCurrentView({
                elements,
                type: CORRESPONDANTS,
            });

            setCorrespondantView({
                elements: createCorrespondants(
                    uniqueCorrespondantsByDomain,
                    node.id
                ),
                type: CORRESPONDANTS,
            });
        }

        if (currentView?.type === CORRESPONDANTS) {
            setBreadcrumb({
                history: [currentDomain, node.data.name],
                id: "year",
            });
            setCurrentCorrespondant(node.data.name);

            const yearByCorrespondants = getYearByCorrespondants(
                pstFile!,
                node.data.name
            );

            const elements = createYears(yearByCorrespondants, node.id);
            const totalLevelMails = getTotalLevelMail(elements);
            setTotalMailPerLevel(totalLevelMails);

            setCurrentView({
                elements,
                type: YEAR,
            });

            setYearView({
                elements,
                type: YEAR,
            });
        }

        if (currentView?.type === YEAR) {
            setBreadcrumb({
                history: [currentDomain, currentCorrespondant, node.data.name],
                id: "mails",
            });

            const mailsByYearAndCorrespondant = getMailsByDym(
                pstFile!,
                currentDomain,
                currentCorrespondant,
                +node.data.name
            );
            const elements = createMails(mailsByYearAndCorrespondant, node.id);
            const totalLevelMails = getTotalLevelMail(elements);
            setTotalMailPerLevel(totalLevelMails);

            setCurrentView({
                elements,
                type: MAILS,
            });
        }

        trackerService?.getProvider().track("Feat(3.0) Element Traversed", {
            viewType:
                currentView?.type === DOMAIN
                    ? CORRESPONDANTS
                    : currentView?.type === CORRESPONDANTS
                    ? YEAR
                    : MAILS,
        });

        return;
    };

    return {
        computeNextView,
        computePreviousView,
        currentView,
        restartView,
    };
};
