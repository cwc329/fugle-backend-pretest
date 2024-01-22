module.exports = {
  transform: {
    "^.+\\.ts?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  testRegex: '/tests/.*\\.test\\.tsx?$',
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
}
