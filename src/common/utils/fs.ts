import type { WriteFileOptions } from "fs";
import { promises as fs } from "fs";
import { ensureDir, pathExists } from "fs-extra";
import path from "path";

const FRAGMENT_LIMIT = 250;
const CURRENT_PATH = "./";

export const outputFile = async (
    file: string,
    data: Parameters<typeof fs.writeFile>[1],
    cwd: string,
    options?: WriteFileOptions
): pvoid => {
    const originalCwd = process.cwd();
    process.chdir(cwd);

    let pathFragments = file.split(path.sep);
    if (pathFragments[0] === "") {
        pathFragments = pathFragments.slice(1, pathFragments.length);
    }

    const fileName = pathFragments.splice(pathFragments.length - 1, 1)[0] ?? ""; // get and remove last fragment

    for (let frag of pathFragments) {
        if (frag.length > FRAGMENT_LIMIT) {
            frag = frag.substring(0, FRAGMENT_LIMIT);
        }

        await ensureDir(frag);
        process.chdir(frag);
    }

    // filename should be at (250 char - "./".length - ".eml".length)
    const { name, ext } = path.parse(fileName);
    const maxLength = FRAGMENT_LIMIT - CURRENT_PATH.length - ext.length;
    const strippedFileName = name.substring(0, maxLength);
    await fs.writeFile(
        `${CURRENT_PATH}${strippedFileName}${ext}`,
        data,
        options
    );

    process.chdir(originalCwd);
};

const INCRE_REGEX = /(.+) \((\d+)\)$/i;

export const ensureIncrementalFolderName = async (
    dest: string
): Promise<string> => {
    if (!(await pathExists(dest))) {
        return dest;
    }

    let newDest = dest;
    const incrementalResult = new RegExp(INCRE_REGEX).exec(newDest);
    if (!incrementalResult) {
        newDest = `${newDest} (1)`;
    } else {
        newDest = `${incrementalResult[1]} (${+incrementalResult[2]! + 1})`;
    }

    return ensureIncrementalFolderName(newDest);
};

export const ensureIncrementalFileName = async (
    dest: string
): Promise<string> => {
    if (!(await pathExists(dest))) {
        return dest;
    }

    const { dir, ext, name } = path.parse(dest);
    let newName = name;
    const incrementalResult = new RegExp(INCRE_REGEX).exec(newName);
    if (!incrementalResult) {
        newName = `${newName} (1)`;
    } else {
        newName = `${incrementalResult[1]} (${+incrementalResult[2]! + 1})`;
    }

    const newDest = path.format({ dir, ext, name: newName });
    if (!(await pathExists(newDest))) {
        return newDest;
    }

    return ensureIncrementalFileName(newDest);
};
