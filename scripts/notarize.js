require("dotenv").config();
const { notarize } = require("electron-notarize");
const { appId: appBundleId } = require("../package.json").build;

exports.default = async function notarizing(context) {
    const { electronPlatformName, appOutDir } = context;
    if (electronPlatformName !== "darwin" || !process.env.APPLE_ID) {
        return;
    }
    const appName = context.packager.appInfo.productFilename;

    return await notarize({
        appBundleId,
        appPath: `${appOutDir}/${appName}.app`,
        appleId: process.env.APPLEID,
        appleIdPassword: process.env.APPLEIDPASS,
    });
};
