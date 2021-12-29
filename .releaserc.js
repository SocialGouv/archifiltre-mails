/** @type {"normal" | "version"} */
const releaseMode = process.env.ARCHIMAIL_RELEASE_MODE ?? "normal";

/** @type {import("semantic-release").Options["plugins"]} */
const plugins = [
    "@semantic-release/commit-analyzer",
    [
        "@semantic-release/npm",
        {
            npmPublish: false,
        },
    ],
];

if (releaseMode === "normal") {
    plugins.push(
        "@semantic-release/release-notes-generator",
        "@semantic-release/changelog",
        [
            "@semantic-release/git",
            {
                assets: ["CHANGELOG.md", "package.json"],
                message:
                    "chore(${nextRelease.type}-release): ${nextRelease.gitTag} [skip ci]\n\n${nextRelease.notes}",
            },
        ],
        [
            "@semantic-release/github",
            {
                assets: ["bin/*/archimail.@(exe|dmg|AppImage|msi)?(.sha512)"],
                releasedLabels: false,
                successComment: false,
            },
        ]
    );
} else if (releaseMode === "version") {
    plugins.push([
        "@semantic-release/exec",
        {
            publishCmd:
                "/usr/bin/git tag -d ${nextRelease.gitTag} && /usr/bin/git push origin :${nextRelease.gitTag}",
        },
    ]);
} else {
    throw new Error(
        `process.env.ARCHIMAIL_RELEASE_MODE unknown (found=${process.env.ARCHIMAIL_RELEASE_MODE})`
    );
}

/** @type {import("semantic-release").Options} */
const config = {
    branches: [
        "feature/release-ci",
        "main",
        {
            channel: "next",
            name: "dev",
            prerelease: "next",
        },
        {
            name: "beta",
            prerelease: true,
        },
    ],
    plugins,
};

module.exports = config;
