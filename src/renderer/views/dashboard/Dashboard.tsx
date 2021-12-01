import type { FC } from "react";
import React from "react";

import { ImportPicto } from "../../../renderer/components/common/pictos/picto";
import { CirclePacking } from "../../../renderer/components/vizualisation/CirclePacking";
import { StaticImage } from "../../components/common/staticImage/StaticImage";
import style from "./Dashboard.module.scss";

interface CardProps {
    title: string;
    color?: "blue" | "green" | "grey" | "orange" | "purple";
}

export const Card: FC<CardProps> = ({ children, title, color = "grey" }) => {
    return (
        <div className={style.card}>
            <div className={style.card__title}>
                <div
                    className={`${style.card__title__color} ${style[color]}`}
                />
                <div className={style.card__title__txt}>{title}</div>
            </div>
            {children}
        </div>
    );
};

export const DashboardActionsBar: FC = () => {
    return (
        <div className={style.dashboard__actions__bar}>
            <div className={style.dashboard__actions__btn}>
                <ImportPicto />
                <button>Importer</button>
            </div>
        </div>
    );
};

export const DashboardRecapItem: FC = () => (
    <div className={style.dashboard__recap__item}>
        <div className={style.dashboard__recap__picto}>
            <ImportPicto />
        </div>
        <div className={style.dashboard__recap__informations}>
            <span className={style.dashboard__recap__informations__item}>
                Messages Reçus
            </span>
            <span className={style.dashboard__recap__informations__item}>
                21%
            </span>
            <span className={style.dashboard__recap__informations__item}>
                15 000 mails
            </span>
            <span className={style.dashboard__recap__informations__item}>
                3500pj
            </span>
        </div>
    </div>
);

export const DashboardRecap: FC = () => {
    return (
        <Card title="Synthèse" color="blue">
            <div className={style.dashboard__recap}>
                <DashboardRecapItem />
                <DashboardRecapItem />
                <DashboardRecapItem />
                <DashboardRecapItem />
                <DashboardRecapItem />
            </div>
        </Card>
    );
};

export const DashboardInformations: FC = () => {
    return (
        <Card title="Informations" color="green">
            <div className="dashboard__informations">
                Informations relatives au PST.
            </div>
        </Card>
    );
};

export const DashboardImpactItem: FC = () => (
    <div className="dashboard__impact__item">
        <div className="dashboard__impact__item__picto">
            <StaticImage src="pictos/globe.png" alt="globe" />
        </div>
        <div className="dashboard__impact__item__infos">
            <span>25go</span>
            <span>supprimés sur 5</span>
        </div>
    </div>
);

export const DashboardImpact: FC = () => {
    return (
        <Card title="Impact" color="orange">
            <div className="dashboard__impact">
                <DashboardImpactItem />
                <DashboardImpactItem />
                <DashboardImpactItem />
            </div>
        </Card>
    );
};

export const DashboardVizualisationBreadcrumb: FC = () => (
    <div className={style.dashboard__vizualisation__breadcrumb}>
        <div className={style.dashboard__vizualisation__breadcrumb__item}>
            Home
        </div>
        <div className={style.dashboard__vizualisation__breadcrumb__item}>
            Niveau 1
        </div>
        <div className={style.dashboard__vizualisation__breadcrumb__item}>
            Niveau 2
        </div>
        <div className={style.dashboard__vizualisation__breadcrumb__item}>
            Niveau 3
        </div>
        <div className={style.dashboard__vizualisation__breadcrumb__item}>
            Niveau 4
        </div>
        <div className={style.dashboard__vizualisation__breadcrumb__item}>
            Niveau 5
        </div>
    </div>
);

export const DashboardVizualisationCircle: FC = () => (
    <div className={style.dashboard__vizualisation__circle}>
        <CirclePacking />
    </div>
);

export const Dashboard: FC = () => {
    return (
        <div className={style.dashboard}>
            <DashboardActionsBar />
            <div className={style.dashboard__cards}>
                <div className={style.dashboard__vizualisation}>
                    <Card title="Visualisation" color="grey">
                        <DashboardVizualisationBreadcrumb />
                        <DashboardVizualisationCircle />
                    </Card>
                </div>
                <div className={style.dashboard__informations}>
                    <DashboardRecap />
                    <DashboardInformations />
                    <DashboardImpact />
                </div>
            </div>
        </div>
    );
};

// import type { FC } from "react";
// import React, { useCallback, useState } from "react";

// import { CirclePacking } from "../../../renderer/components/vizualisation/CirclePacking";
// import { Layout } from "../../components/common/layout/Layout";
// import style from "./Dashboard.module.scss";

// export const DashboardBreadcrumb: FC = () => (
//     <div className={style.dashboard__breadcrumb}>
//         <div className={style.dashboard__breadcrumb__item}>Home</div>
//         <div className={style.dashboard__breadcrumb__item}>Niveau 1</div>
//         <div className={style.dashboard__breadcrumb__item}>Niveau 2</div>
//         <div className={style.dashboard__breadcrumb__item}>Niveau 3</div>
//         <div className={style.dashboard__breadcrumb__item}>Niveau 4</div>
//         <div className={style.dashboard__breadcrumb__item}>Niveau 5</div>
//     </div>
// );

// export const DashboardVizualisation: FC<{ setData: (el: string) => void }> = ({
//     setData,
// }) => (
//     <div className={style.dashboard__vizualisation}>
//         <CirclePacking setData={setData} />
//     </div>
// );

// export const DashboardPanel: FC<{ data: string }> = ({ data }) => {
//     const [expand, setExpand] = useState<number>(0);

//     const sectionOpener = useCallback(
//         (index: number) => {
//             setExpand(index);
//         },
//         [setExpand]
//     );

//     return (
//         <div className={style.dashboard__panel}>
//             {["synthèse", "informations", "historique", "impact"].map(
//                 (title, index) => (
//                     <DashboardPanelSection
//                         title={title}
//                         key={index}
//                         isExpand={expand === index}
//                         sectionOpener={() => {
//                             sectionOpener(index);
//                         }}
//                         data={data}
//                     />
//                 )
//             )}
//         </div>
//     );
// };

// export const DashboardPanelSection: FC<{
//     title: string;
//     sectionOpener: () => void;
//     isExpand: boolean;
//     data: string;
// }> = ({ title, sectionOpener, isExpand, data }) => {
//     const className = isExpand
//         ? `${style.dashboard__panel__section} ${style.dashboard__panel__section} ${style.isExpand}`
//         : style.dashboard__panel__section;
//     return (
//         <div className={className}>
//             <button
//                 className={style.dashboard__panel__section__title}
//                 onClick={sectionOpener}
//             >
//                 {title}
//             </button>
//             {isExpand && `représentation: ${data}`}
//         </div>
//     );
// };

// export const Dashboard: React.FC = () => {
//     const [data, setData] = useState<string>("");
//     const getData = (el: string) => {
//         setData(el);
//     };

//     console.log(data);

//     return (
//         <Layout className={style.dashboard}>
//             <div className={style.dashboard__actions}>
//                 <div className={style.dashboard__actions__item}>
//                     <button>importer</button>
//                 </div>
//                 <div className={style.dashboard__actions__item}>
//                     <button>filtrer</button>
//                 </div>
//                 <div className={style.dashboard__actions__item}>
//                     <button>supprimer</button>
//                 </div>
//                 <div className={style.dashboard__actions__item}>
//                     <button>conserver</button>
//                 </div>
//                 <div className={style.dashboard__actions__item}>
//                     <button>exporter</button>
//                 </div>
//             </div>
//             <div className={style.dashboard__interactive}>
//                 <DashboardBreadcrumb />
//                 <DashboardVizualisation setData={getData} />
//             </div>
//             <DashboardPanel data={data} />
//         </Layout>
//     );
// };
