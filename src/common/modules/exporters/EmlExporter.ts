import { isPstEmail } from "../../../common/modules/pst-extractor/type";
import type { EmlFile } from "../../utils/exporter";
import { createDir, createEmlFile } from "../../utils/exporter";
import type { PstElement } from "./../pst-extractor/type";
import type { Exporter } from "./Exporter";

/**
 * Export PST to EML archive.
 */
export const emlExporter: Exporter = {
    async export<T>(obj: T[], dest: string): Promise<void> {
        const exportEml = async (pst: PstElement, path?: string) => {
            pst.children?.forEach(async (child) => {
                if (isPstEmail(child)) {
                    const wrapPath = `${path}${child.elementPath}/${child.subject}/${child.subject}`;

                    const mailContent: EmlFile = {
                        body: child.contentText
                            .replaceAll("\n", "")
                            .replaceAll("\r", ""),
                        from: child.from.email,
                        isSent: child.isFromMe ? 0 : 1,
                        subject: child.subject,
                        to: child.to
                            .map((recipient) => recipient.email)
                            .join(" "),
                    };

                    await createEmlFile(wrapPath, mailContent);
                } else {
                    const destinationPath = `${path}/`;
                    const folderPath =
                        child.elementPath === ""
                            ? destinationPath + child.name
                            : destinationPath + child.elementPath.substring(1); // remove first '/'
                    await createDir(folderPath);
                }
                await exportEml(child, path);
            });
        };

        await exportEml(obj as unknown as PstElement, dest);
        // return Promise.resolve();
    },
};
