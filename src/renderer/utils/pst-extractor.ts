import type {
    PstContent,
    PstEmail,
    PstExtractTables,
} from "@common/modules/pst-extractor/type";

/**
 * Get all folder name from a given PST.
 */
export const getPstFolderList = (pst: PstContent): string[] =>
    pst.children[0]!.children!.map(({ name }) => name);

export const getExtremumDate = (
    dates: PstEmail[],
    compare: "max" | "min",
    messageType: "receivedDate" | "sentTime"
): Date =>
    new Date(
        Math[compare](
            ...dates.map((date) => new Date(date[messageType]!).getTime())
        )
    );

interface ExtremeMailDates {
    maxDate: Date;
    minDate: Date;
}
export const getExtremeMailsDates = (
    extractTables: PstExtractTables
): ExtremeMailDates => {
    const dates: PstEmail[] = [...Object(extractTables.emails).values()].flat();

    const extremumMaxS = getExtremumDate(dates, "max", "sentTime");
    const extremumMinS = getExtremumDate(dates, "min", "sentTime");

    const extremumMaxR = getExtremumDate(dates, "max", "receivedDate");
    const extremumMinR = getExtremumDate(dates, "min", "receivedDate");

    const maxDate = extremumMaxR > extremumMaxS ? extremumMaxR : extremumMaxS;
    const minDate = extremumMinR < extremumMinS ? extremumMinR : extremumMinS;

    return { maxDate, minDate };
};
