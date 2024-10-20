module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: [
    './src/setupTests.ts',
    './src/jest.setup.ts'
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "babel-jest",
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transformIgnorePatterns: ["<rootDir>/node_modules/"]
};