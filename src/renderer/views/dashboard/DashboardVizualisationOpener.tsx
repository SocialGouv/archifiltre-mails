// import React, { useCallback, useState } from "react";

// import { CirclePacking } from "../../components/vizualisation/CirclePacking";
// import type { VIZUALISATION } from "../../utils/constants";
// import style from "./Dashboard.module.scss";

// // Testing purpose
// export const DashboardVizualisationOpener: React.FC = () => {
//     const [vizualisation, setVizualisation] = useState<
//         VIZUALISATION | undefined
//     >(undefined);

//     const IS_CIRCLE_PACKING = vizualisation === "vizualisation.circle-packing";

//     const openCirclePackingVizualisation = useCallback(() => {
//         setVizualisation("vizualisation.circle-packing");
//     }, []);

//     const closeVizualisation = useCallback(() => {
//         setVizualisation(undefined);
//     }, []);

//     return (
//         <div className={style.general}>
//             <button onClick={openCirclePackingVizualisation}>
//                 Open Circle Packing Vizualisation
//             </button>{" "}
//             {IS_CIRCLE_PACKING && <CirclePacking closer={closeVizualisation} />}
//         </div>
//     );
// };
