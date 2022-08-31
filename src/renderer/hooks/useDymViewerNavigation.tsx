import { useService } from "@common/modules/ContainerModule";
import type { ComputedDatum } from "@nivo/circle-packing/dist/types/types";
import { useCallback, useEffect } from "react";

import { useBreadcrumbStore } from "../store/BreadcrumbStore";
import { usePstFMInfosStore } from "../store/PstFMInfosStore";
import { usePstStore } from "../store/PSTStore";
import { viewListStore } from "../store/ViewListStore";
import { CORRESPONDANTS, DOMAIN, MAILS, YEAR } from "../utils/constants";
import type { DefaultViewerObject } from "../utils/dashboard-viewer-dym";
import {
    createMails,
    createNodes,
    createRootView,
    mapOrderByValues,
    mapToRecord,
} from "../utils/dashboard-viewer-dym";
import { useViewGroupByFunctions } from "./useViewGroupByFunctions";

export interface UseDomainsYearMailsProps {
    computeNextView: (node: ComputedDatum<DefaultViewerObject>) => void;
    computePreviousView: () => void;
    currentViewIndex: number;
    resetView: () => void;
    viewList: ViewState<DefaultViewerObject>[];
}

export interface ViewState<TElement> {
    elements: TElement;
    type: string;
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
    const {
        addViewsCallback,
        addViewsGetter,
        setViewAt,
        setList: setViewList,
        currentIndex: currentViewIndex,
        list: viewList,
        setCurrentIndex: setCurrentViewIndex,
    } = viewListStore.getState();
    const { extractDatas } = usePstStore();
    const { cancelFocus } = usePstFMInfosStore();
    const { getCurrentViewGroupByFunctions } = useViewGroupByFunctions();
    const groupByFunctions = getCurrentViewGroupByFunctions();
    const pstExtractorService = useService("pstExtractorService");

    const { resetBreadcrumb } = useBreadcrumbStore();

    // const [viewList, setViewList] = useState<ViewState<DefaultViewerObject>[]>(
    //     []
    // );
    // const [currentViewIndex, setCurrentViewIndex] = useState(0);
    // const [currentDomain, setCurrentDomain] = useState<string>("");
    // const [currentCorrespondant, setCurrentCorrespondant] =
    //     useState<string>("");

    // const [currentView, setCurrentView] = // TODO: change with memoized value
    //     useState<ViewState<DefaultViewerObject>>();

    // const [domainView, setDomainView] =
    //     useState<ViewState<DomainViewerObject>>();

    // const [correspondantView, setCorrespondantView] =
    //     useState<ViewState<DefaultViewerObject>>();

    // const [yearView, setYearView] = useState<ViewState<DefaultViewerObject>>();

    const trackerService = useService("trackerService");

    const createInitialView = useCallback(() => {
        const initialViewType = groupByFunctions[0]!.type;
        // const aggregatedDomain = getAggregatedDomains(pstFile!);
        const aggregatedFirstGroup = mapToRecord(
            mapOrderByValues(
                extractDatas!.groups[initialViewType]!,
                (a, b) => b.length - a.length
            )
        );

        // TODO: ViewFilter store
        // Liste des view à afficher sinon DEFAULT_VIEW_LIST
        const computedInitialView: ViewState<DefaultViewerObject<"root">> = {
            elements: createRootView(aggregatedFirstGroup),
            type: initialViewType,
        };

        return computedInitialView;
    }, [extractDatas, groupByFunctions]);

    useEffect(() => {
        const computedInitialView = createInitialView();
        // setCurrentView(computedInitialView);
        // setCurrentViewIndex(0);
        setViewList([computedInitialView]);
    }, [createInitialView, setCurrentViewIndex, setViewList]);

    const resetView = () => {
        const computedInitialView = createInitialView();
        // setCurrentView(computedInitialView);
        setCurrentViewIndex(0);
        setViewList([computedInitialView]);
        resetBreadcrumb();
        cancelFocus();
        // setInitialAttachmentPerLevel();
        // setInitialTotalMailPerLevel();
        // setInitialFileSizePerLevel();
        // setBreadcrumb({ id: computedInitialView.type });
    };

    const computePreviousView = () => {
        cancelFocus();
        // setPreviousAttachmentPerLevel();
        // setPreviousTotalMailsPerLevel();
        // setPreviousFileSizePerLevel();

        if (currentViewIndex > 0) {
            const previousIndex = currentViewIndex - 1;
            // const previousView = viewList[previousIndex];
            setCurrentViewIndex(previousIndex);
            // setPreviousBreadcrumb();
            // setCurrentView(previousView);
            // setPreviousBreadcrumb(previousView!.type);
        }

        // if (currentView?.type === CORRESPONDANTS) {
        //     setCurrentView(domainView);
        //     setPreviousBreadcrumb("domain");
        // }
        // if (currentView?.type === YEAR) {
        //     setCurrentView(correspondantView);
        //     setPreviousBreadcrumb("correspondant");
        // }

        // if (currentView?.type === MAILS) {
        //     setCurrentView(yearView);
        //     setPreviousBreadcrumb("year");
        // }

        return;
    };

    const computeNextView = async (
        node: ComputedDatum<DefaultViewerObject>
    ) => {
        // e.g. ["domain", "recipient"] ; going on recipient
        const currentView = viewList[currentViewIndex];
        if (!currentView) {
            return;
        }

        const nextIndex = currentViewIndex + 1;
        setCurrentViewIndex(nextIndex);

        const sameView = viewList[nextIndex];
        if (sameView?.elements.name === node.data.name) {
            return;
        }

        // ok, not the same view
        const nextViewGroupBy = groupByFunctions[nextIndex];

        if (nextViewGroupBy) {
            const nextDatasFilter = new Map(
                [
                    ...(extractDatas?.groups[nextViewGroupBy.type]?.entries() ??
                        []),
                ].reduce<[string, string[]][]>((acc, [keyToKeep, nextIds]) => {
                    const idsToKeep = nextIds.filter((id) =>
                        node.data.ids.includes(id)
                    );
                    if (idsToKeep.length) {
                        return [...acc, [keyToKeep, idsToKeep]];
                    }
                    return acc;
                }, [])
            );

            const orderedNextDatas = mapOrderByValues(
                nextDatasFilter,
                (a, b) => b.length - a.length
            );

            const elements = createNodes(orderedNextDatas, node.id, node.data);
            setViewAt(nextIndex, { elements, type: nextViewGroupBy.type });
        } else {
            if (!pstExtractorService || !extractDatas) return;
            const indexes = node.data.ids.map(
                (id) => extractDatas.indexes.get(id)!
            );
            const mails = (await pstExtractorService.getEmails(indexes)).sort(
                (a, b) =>
                    (a.receivedDate?.valueOf() ?? 0) -
                    (b.receivedDate?.valueOf() ?? 0)
            );

            const elements = createMails(mails, node.id);
            addViewsGetter({ elements, type: "mail" });
        }
        // if (currentView.type === DOMAIN) {
        //     // setCurrentDomain(node.data.name);
        //     // setBreadcrumb({
        //     //     history: [node.data.name],
        //     //     id: "correspondant",
        //     // });

        //     // TODO: intersection instead between node.data and currentViewFilter
        //     const uniqueCorrespondantsByDomain =
        //         getUniqueCorrespondantsByDomain(pstFile!, node.data.name);

        //     // TODO: createNode instead
        //     const elements = createCorrespondants(
        //         uniqueCorrespondantsByDomain,
        //         node.id
        //     );

        //     // const totalLevelMails = getTotalLevelMail(elements);
        //     // setTotalMailPerLevel(totalLevelMails);

        //     // setCurrentView({
        //     //     elements,
        //     //     type: CORRESPONDANTS,
        //     // });

        //     // setCorrespondantView({
        //     //     elements: createCorrespondants(
        //     //         uniqueCorrespondantsByDomain,
        //     //         node.id
        //     //     ),
        //     //     type: CORRESPONDANTS,
        //     // });
        // }

        // if (currentView.type === CORRESPONDANTS) {
        //     setBreadcrumb({
        //         history: [currentDomain, node.data.name],
        //         id: "year",
        //     });
        //     setCurrentCorrespondant(node.data.name);

        //     const yearByCorrespondants = getYearByCorrespondants(
        //         pstFile!,
        //         node.data.name
        //     );

        //     const elements = createYears(yearByCorrespondants, node.id);
        //     const totalLevelMails = getTotalLevelMail(elements);
        //     setTotalMailPerLevel(totalLevelMails);

        //     setCurrentView({
        //         elements,
        //         type: YEAR,
        //     });

        //     setYearView({
        //         elements,
        //         type: YEAR,
        //     });
        // }

        // if (currentView.type === YEAR) {
        //     setBreadcrumb({
        //         history: [currentDomain, currentCorrespondant, node.data.name],
        //         id: "mails",
        //     });

        //     const mailsByYearAndCorrespondant = getMailsByDym(
        //         pstFile!,
        //         currentDomain,
        //         currentCorrespondant,
        //         +node.data.name
        //     );
        //     const elements = createMails(mailsByYearAndCorrespondant, node.id);
        //     const totalLevelMails = getTotalLevelMail(elements);
        //     setTotalMailPerLevel(totalLevelMails);

        //     setCurrentView({
        //         elements,
        //         type: MAILS,
        //     });
        // }

        trackerService?.getProvider().track("Feat(3.0) Element Traversed", {
            viewType:
                currentView.type === DOMAIN
                    ? CORRESPONDANTS
                    : currentView.type === CORRESPONDANTS
                    ? YEAR
                    : MAILS,
        });

        return;
    };

    return {
        computeNextView,
        computePreviousView,
        currentViewIndex,
        resetView,
        viewList,
    };
};
