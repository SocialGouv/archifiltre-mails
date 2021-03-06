import type { PstExtractTables } from "@common/modules/pst-extractor/type";
import createHook from "zustand/index";
import create from "zustand/vanilla";

export interface ImpactState {
    size: number;
    toDeleteIDs: Set<string>;
    updateToDeleteImpact: (ids: string[], impact: "add" | "delete") => void;
}
let attachementMap: PstExtractTables["attachements"] | undefined = void 0;
const impactStore = create<ImpactState>((set) => ({
    size: 0,
    toDeleteIDs: new Set(),
    updateToDeleteImpact: (ids: string[], impact: "add" | "delete"): void => {
        set((state) => {
            ids.forEach((id) =>
                state.toDeleteIDs[impact /* "add" or "delete" function */](id)
            );
            if (!attachementMap) return;
            const totalDeletedSize = [...state.toDeleteIDs].reduce(
                (acc, id) =>
                    acc +
                    (attachementMap!
                        .get(id)
                        ?.reduce((accAtt, att) => accAtt + att.filesize, 0) ??
                        0),

                0
            );
            return { ...state, size: totalDeletedSize };
        });
    },
}));

const impactStoreHook = createHook(impactStore);
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types -- Deal with it.
export const useImpactStore = (am?: PstExtractTables["attachements"]) => {
    if (!attachementMap) {
        attachementMap = am;
    }
    return impactStoreHook();
};
