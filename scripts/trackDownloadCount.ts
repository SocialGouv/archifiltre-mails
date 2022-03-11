/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/naming-convention */
import { graphql } from "@octokit/graphql";
import type { ReleaseConnection, Repository } from "@octokit/graphql-schema";
import axios from "axios";
import { config } from "dotenv";
import { inspect } from "util";

import { version as $lib_version } from "../package.json";

config();

const dryRun = "DRY_RUN" in process.env;
// const dryRun = true as unknown as boolean;

if (dryRun) console.log("DRY RUN MODE ============");

void (async () => {
    if (!process.env.TRACKER_POSTHOG_URL) {
        throw new Error("TRACKER_POSTHOG_URL is missing.");
    }
    if (!process.env.TRACKER_POSTHOG_API_KEY) {
        throw new Error("TRACKER_POSTHOG_URL is missing.");
    }
    if (!process.env.GITHUB_TOKEN) {
        throw new Error("GITHUB_TOKEN is missing.");
    }

    const baseEvents = {
        linuxDownloadCount: 0,
        linuxLastDownloadDate: null as Date | null,
        macDownloadCount: 0,
        macLastDownloadDate: null as Date | null,
        version: "",
        winDownloadCount: 0,
        winLastDownloadDate: null as Date | null,
    };

    const query = `#graphql
        query($cursor: String) {
            repository(name: "archifiltre-mails", owner: "SocialGouv") {
                releases(first: 3, after: $cursor) {
                    pageInfo {
                        endCursor
                        hasNextPage
                    }
                    nodes {
                        tagName
                        releaseAssets(first: 20) {
                            nodes {
                                downloadCount
                                name
                                updatedAt
                            }
                        }
                    }
                }
            }
        }
    ` as const;

    const batch: NonNullable<ReleaseConnection["nodes"]> = [];
    async function fetchReleases(cursor?: string) {
        const {
            repository: { releases },
        } = await graphql<{ repository: Repository }>(query, {
            cursor,
            headers: {
                authorization: `token ${process.env.GITHUB_TOKEN}`,
            },
        });

        batch.push(...(releases.nodes ?? []));

        if (releases.pageInfo.hasNextPage) {
            await fetchReleases(releases.pageInfo.endCursor!);
        }
    }

    console.info("Get all releases...");
    await fetchReleases();

    console.info("Parse...");
    const events: typeof baseEvents[] = [];
    for (const release of batch) {
        if (!release) continue;

        const version = release.tagName;
        const versionEvent = { ...baseEvents, version };

        for (const asset of release.releaseAssets.nodes ?? []) {
            if (!asset) continue;

            if (asset.name.endsWith(".AppImage")) {
                versionEvent.linuxDownloadCount += asset.downloadCount;
                versionEvent.linuxLastDownloadDate = new Date(
                    asset.updatedAt as string
                );
            } else if (
                asset.name.endsWith(".dmg") ||
                asset.name.endsWith(".zip")
            ) {
                versionEvent.macDownloadCount += asset.downloadCount;
                const lastDate = new Date(asset.updatedAt as string);
                if (versionEvent.macLastDownloadDate) {
                    versionEvent.macLastDownloadDate = new Date(
                        Math.max(+versionEvent.macLastDownloadDate, +lastDate)
                    );
                } else {
                    versionEvent.macLastDownloadDate = lastDate;
                }
            } else if (
                asset.name.endsWith(".exe") ||
                asset.name.endsWith(".msi")
            ) {
                versionEvent.winDownloadCount += asset.downloadCount;
                const lastDate = new Date(asset.updatedAt as string);
                if (versionEvent.winLastDownloadDate) {
                    versionEvent.winLastDownloadDate = new Date(
                        Math.max(+versionEvent.winLastDownloadDate, +lastDate)
                    );
                } else {
                    versionEvent.winLastDownloadDate = lastDate;
                }
            }
        }

        events.push(versionEvent);
    }

    console.log(inspect(events));

    console.info("Send 'App Download' events to PostHog...");
    for (const props of events) {
        console.info("Send for version", props.version);
        const properties = {
            ...props,
            $lib: "track-download-count",
            $lib_version,
            $set_once: {
                name: "github-action",
            },
            distinct_id: "github-action",
        };
        if (dryRun) {
            console.info(inspect(properties, { colors: true }));
            continue;
        }
        await axios.post(
            `${process.env.TRACKER_POSTHOG_URL}/capture`,
            {
                api_key: process.env.TRACKER_POSTHOG_API_KEY,
                event: "App Download",
                properties,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
    console.log("Done!");
})();
