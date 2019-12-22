const micromatch = require('micromatch');

module.exports = {
  '*.{js,jsx}': files => {
    const match = micromatch.not(files, '**/config/*.config.js');

    return `eslint ${match.join(' ')} -c ./config/.eslintrc`;
  },
};
