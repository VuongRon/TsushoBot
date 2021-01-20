module.exports = {
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig-noncomposite-base.json'
        }
    },
    moduleFileExtensions: [
        'ts',
        'js'
    ],
    transform: {
        '^.+\\.ts$': 'ts-jest'
    },
    testMatch: [
        '**/test/**/*.test.(ts|js)'
    ],
    testEnvironment: 'node',
};