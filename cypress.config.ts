import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      snapshotOnly: true,
    },
    baseUrl: "https://opensource-demo.orangehrmlive.com",
  },
  viewportWidth: 1728,
  viewportHeight: 1117,
});
