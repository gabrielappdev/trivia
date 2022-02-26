module.exports = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@components(.*)$": "<rootDir>/src/components$1",
    "^@pages(.*)$": "<rootDir>/src/pages$1",
    "^@hooks(.*)$": "<rootDir>/src/hooks$1",
    "^@layouts(.*)$": "<rootDir>/src/layouts$1",
  },
};
