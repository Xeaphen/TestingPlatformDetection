const path = require('path');
const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = {
  entry: {
    index: './src/index.js',
  },
  output: {
    path: `${__dirname}-dist`,
    filename: '[name].js', // output: abc.js, cde.js
  },
  plugins: [
    new JavaScriptObfuscator({
      compact: true,
      controlFlowFlattening: false,
      controlFlowFlatteningThreshold: 0.75,
      deadCodeInjection: false,
      deadCodeInjectionThreshold: 0.4,
      debugProtection: true,
      debugProtectionInterval: false,
      disableConsoleOutput: true,
      domainLock: [],
      identifierNamesGenerator: 'hexadecimal',
      identifiersDictionary: [],
      identifiersPrefix: '',
      inputFileName: '',
      log: false,
      renameGlobals: false,
      reservedNames: [],
      reservedStrings: [],
      rotateStringArray: true,
      seed: 0,
      selfDefending: false,
      shuffleStringArray: false,
      sourceMap: false,
      sourceMapBaseUrl: '',
      sourceMapFileName: '',
      sourceMapMode: 'separate',
      splitStrings: false,
      splitStringsChunkLength: 10,
      stringArray: true,
      stringArrayEncoding: [],
      stringArrayThreshold: 0.75,
      target: 'browser',
      transformObjectKeys: true,
      unicodeEscapeSequence: false,
    }),
  ],
};
