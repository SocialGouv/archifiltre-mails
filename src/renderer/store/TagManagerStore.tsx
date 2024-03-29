import type { ComputedDatum } from "@nivo/circle-packing";
import create from "zustand";

import type { ViewerObject } from "../utils/dashboard-viewer-dym";

type HoveredNode = ComputedDatum<ViewerObject<string>>;
interface TaggedNodesFromWorkLoading {
    deleteIds: string[];
    keepIds: string[];
}

export interface TagManagerStore {
    deleteIds: string[];
    hoveredNode: HoveredNode | null;
    keepIds: string[];
    setDeleteIds: () => void;
    setHoveredNode: (hoveredNode: HoveredNode | null) => void;
    setKeepIds: () => void;
    setTaggedNodesFromWorkLoading: (
        taggedNodesIds: TaggedNodesFromWorkLoading
    ) => void;
}

export const tagManagerStore = create<TagManagerStore>((set, get) => ({
    deleteIds: [],
    hoveredNode: null,
    keepIds: [],
    setDeleteIds: () => {
        const newDeleteIds = get().hoveredNode?.data.ids ?? [];
        const currentKeepIds = get().keepIds;
        const currentDeleteIds = get().deleteIds;
        const keepIds = currentKeepIds.filter(
            (id) => !newDeleteIds.includes(id)
        );
        const deleteIds = [...new Set([...currentDeleteIds, ...newDeleteIds])];

        set({ deleteIds, keepIds });
    },
    setHoveredNode: (hoveredNode) => {
        set({ hoveredNode });
    },
    setKeepIds: () => {
        const newKeepIds = get().hoveredNode?.data.ids ?? [];
        const currentKeepIds = get().keepIds;
        const currentDeleteIds = get().deleteIds;
        const deleteIds = currentDeleteIds.filter(
            (id) => !newKeepIds.includes(id)
        );
        const keepIds = [...new Set([...currentKeepIds, ...newKeepIds])];

        set({ deleteIds, keepIds });
    },
    setTaggedNodesFromWorkLoading: (
        taggedNodesIds: TaggedNodesFromWorkLoading
    ) => {
        set({
            deleteIds: taggedNodesIds.deleteIds,
            keepIds: taggedNodesIds.keepIds,
        });
    },
}));
