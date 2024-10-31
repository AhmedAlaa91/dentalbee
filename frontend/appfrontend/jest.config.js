module.exports = {
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.jsx?$': 'babel-jest', // Transform .js and .jsx files using babel-jest
    },
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'], // Add necessary extensions
  };
  