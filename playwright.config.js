/** @type { import("@playwright/test").PlaywrightTestConfig} */
module.exports = {
    reporter: process.env.CI ? "dot" : "list",
    testDir: "test/e2e/",
};
