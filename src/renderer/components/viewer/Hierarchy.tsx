/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useService } from "@common/modules/ContainerModule";
import type {
    PstEmail,
    PstMailIndex,
    PstShallowFolder,
} from "@common/modules/pst-extractor/type";
import { isPlural } from "@common/utils";
import React, { useEffect, useMemo, useState } from "react";

import { usePstStore } from "../../store/PSTStore";
import { DashboardInformationsMail } from "../../views/dashboard/DashboardInformationsMail";
import style from "./Hierarchy.module.scss";

type SetMailInfo = React.Dispatch<React.SetStateAction<PstEmail | undefined>>;

interface HierarchyType {
    hierarchyData: PstShallowFolder[];
    setMailInfo: SetMailInfo;
}

interface HierarchyNodeType {
    isOpen: boolean;
    node: PstShallowFolder;
    onNodeClick: () => void;
    setMailInfo: SetMailInfo;
}

const initialObj = {
    depth: 0,
    formattedValue: "",
    height: 0,
    id: "0",
    path: [""],
    percentage: 0,
    radius: 0,
    value: "0",
    x: 0,
    y: 0,
};

const HierarchyMailsList: React.FC<
    Pick<HierarchyNodeType, "node" | "setMailInfo">
> = ({ node, setMailInfo }) => {
    const pstExtractorService = useService("pstExtractorService");
    const { extractDatas } = usePstStore();
    const [mails, setMails] = useState<PstEmail[]>();
    const [selectedMailId, setSelectedMailId] = useState<string | null>(null);

    const indexes: PstMailIndex[] = node.mails.map(
        (id: string) => extractDatas!.indexes.get(id)!
    );

    useEffect(() => {
        void (async () => {
            if (!mails) {
                const fetchedMails = (
                    await pstExtractorService?.getEmails(indexes)
                )?.sort((a, b) => a.receivedTime - b.receivedTime);

                setMails(fetchedMails);
            }
        })();
    }, [indexes, mails, pstExtractorService]);

    return (
        <div className={style.hierarchy__mailList}>
            {mails?.map((mail) => (
                <div
                    className={style.hierarchy__mailList__item}
                    key={mail.id}
                    onClick={() => {
                        setSelectedMailId(mail.id);
                        setMailInfo(mail);
                    }}
                    style={{
                        backgroundColor:
                            mail.id === selectedMailId ? "#3c86f7" : "#dfecff",
                        color: mail.id === selectedMailId ? "#fff" : "#000",
                    }}
                >
                    {`${new Date(mail.receivedTime).toLocaleDateString()} : ${
                        mail.subject
                    }`}
                </div>
            ))}
        </div>
    );
};

const HierarchyNode: React.FC<HierarchyNodeType> = ({
    node,
    setMailInfo,
    isOpen,
    onNodeClick,
}) => {
    return (
        <>
            <div
                className={
                    isOpen
                        ? `${style.hierarchy__node} ${style.hierarchy__node__active}`
                        : style.hierarchy__node
                }
                onClick={onNodeClick}
                data-haschild={node.subfolders.length}
            >
                <span>
                    {node.name}
                    <small className={style.hierarchy__folderCount}>
                        (
                        {node.hasSubfolders
                            ? `${node.subfolders.length} ${isPlural(
                                  node.subfolders.length,
                                  "dossier"
                              )}`
                            : `${node.mails.length} ${isPlural(
                                  node.mails.length,
                                  "mail"
                              )}`}
                        )
                    </small>
                    <span style={{ fontSize: 15, marginLeft: 5 }}>
                        {isOpen ? "▾" : "▸"}
                    </span>
                </span>
            </div>
            {isOpen && (
                <ul
                    className={style.hierarchy__childrenList}
                    data-expand={isOpen}
                >
                    {node.hasSubfolders ? (
                        <Hierarchy
                            hierarchyData={node.subfolders}
                            setMailInfo={setMailInfo}
                        />
                    ) : (
                        <HierarchyMailsList
                            node={node}
                            setMailInfo={setMailInfo}
                        />
                    )}
                </ul>
            )}
        </>
    );
};
export const Hierarchy: React.FC<HierarchyType> = ({
    hierarchyData,
    setMailInfo,
}) => {
    const [openNodeId, setOpenNodeId] = useState<string | null>(null);

    useEffect(() => {
        setMailInfo(undefined);
    }, [openNodeId, setMailInfo]);

    return (
        <div className={style.hierarchy}>
            {hierarchyData.map((node) => (
                <HierarchyNode
                    key={node.id}
                    node={node}
                    setMailInfo={setMailInfo}
                    isOpen={node.id === openNodeId}
                    onNodeClick={() => {
                        setOpenNodeId(openNodeId === node.id ? null : node.id);
                    }}
                />
            ))}
        </div>
    );
};

export const HierarchyContainer: React.FC = () => {
    const { extractDatas } = usePstStore();
    const [mailInfo, setMailInfo] = useState<PstEmail>();
    const hierarchyData = useMemo(() => {
        return extractDatas?.additionalDatas.folderStructure.subfolders;
    }, [extractDatas]);

    if (!hierarchyData) return null;

    return (
        <div className={style.hierarchyContainer}>
            <Hierarchy
                hierarchyData={hierarchyData}
                setMailInfo={setMailInfo}
            />

            {mailInfo && (
                <div className={style.hierarchy__mailList__mail}>
                    <DashboardInformationsMail
                        view="list"
                        mainInfos={{
                            color: "",
                            data: {
                                children: [],
                                email: mailInfo,
                                ids: [""],
                                name: "",
                                size: 0,
                                ...initialObj,
                            },
                            ...initialObj,
                            value: 0,
                        }}
                    />
                </div>
            )}
        </div>
    );
};
