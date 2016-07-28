//jshint strict: false
exports.config = {

  onPrepare: () => {
      console.log('Loading waitReadyScript...');
      require('./libs/waitReady.js');
  },

  allScriptsTimeout: 11000,

  specs: [
    '*.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:8000/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }

};
