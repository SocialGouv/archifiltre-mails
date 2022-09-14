const ts = require("typescript");

/** @type {Map<string, ts.SourceFile>} */
const sourceFileCache = new Map();

/**
 * @param {string} filePath
 */
module.exports.getDeclaredTypesNames = function (filePath) {
    const sourceFile =
        sourceFileCache.get(filePath) ??
        ts.createProgram([filePath], { noEmit: true }).getSourceFile(filePath);

    sourceFileCache.set(filePath, sourceFile);

    const out = [];
    ts.forEachChild(sourceFile, (node) => {
        if (
            ts.isInterfaceDeclaration(node) ||
            ts.isTypeAliasDeclaration(node)
        ) {
            if (ts.SyntaxKind.DeclareKeyword === node.modifiers?.[0].kind) {
                out.push(node.name.getText(sourceFile));
            }
        }
    });

    return out;
};
