import "@sentry/electron/preload";

import sourceMapSupport from "source-map-support";

sourceMapSupport.install();

module.hot?.accept();

// eslint-disable-next-line no-console
console.info("[Preload] Inited");
