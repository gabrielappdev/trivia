module.exports = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@components(.*)$": "<rootDir>/src/components$1",
    "^@pages(.*)$": "<rootDir>/src/pages$1",
    "^@hooks(.*)$": "<rootDir>/src/hooks$1",
    "^@layouts(.*)$": "<rootDir>/src/layouts$1",
    "^@constants(.*)$": "<rootDir>/src/constants$1",
    "^@icons(.*)$": "<rootDir>/src/icons$1",
    "^@services(.*)$": "<rootDir>/src/services$1",
    "^@atoms(.*)$": "<rootDir>/src/atoms$1",
    "^@helpers(.*)$": "<rootDir>/src/helpers$1",
    "^@tests(.*)$": "<rootDir>/src/tests$1",
    "^@localTypes(.*)$": "<rootDir>/src/types$1",
  },
};
