/* eslint-env node  */
/* global requirejs */

module.exports = function (wallaby) {


  var path = require('path');
  var aureliaJson = require('./aurelia_project/aurelia.json');

  return {

    debug: true,

    files: [
      { pattern: 'node_modules/bluebird/js/browser/bluebird.core.js', instrument: false },
      { pattern: 'node_modules/requirejs/require.js', instrument: false },
      { pattern: 'src/**/*.+(ts|html)', load: false },
      { pattern: 'test/unit/setup.ts', load: false }
    ],

    tests: [
      { pattern: 'test/unit/**/*.spec.ts', load: false }
    ],

    env: {
      kind: 'electron'
    },

    middleware: function (app, express) {
      app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
      app.use('/', express.static(path.join(wallaby.projectCacheDir, 'src')));
    },

    setup: (function (wallaby) {
      wallaby.delayStart();

      requirejs.config({
        packages: []
      });

      require(['/test/unit/setup.js'].concat(wallaby.tests), function () {
        wallaby.start();
      });
    }).toString()
      .replace(
        'packages: []',
        aureliaJson.build.bundles[1].dependencies.reduce(function (prev, curr) {
          var moduleName, modulePath, moduleMain;
          if (curr.path) {
            moduleName = moduleMain = curr.name;
            modulePath = path.relative(
              __dirname,
              path.resolve(__dirname, 'aurelia_project', curr.path))
              .split('\\').join('/');
            if (curr.main) {
              moduleMain = curr.main;
            }
          }
          else {
            moduleName = moduleMain = curr;
            var packageJson = require(moduleName + '/package.json');
            if (packageJson.jspm && packageJson.jspm.format === 'amd') {
              modulePath = 'node_modules/' + moduleName + '/' + packageJson.jspm.directories.dist;
            } else {
              modulePath = 'node_modules/' + moduleName;
              moduleMain = packageJson.main;
            }
          }
          return prev
            + '{ name: ' + JSON.stringify(moduleName)
            + ', location: ' + JSON.stringify(modulePath)
            + ', main: ' + JSON.stringify(moduleMain)
            + '},';
        }, 'packages: [') + ']')
  };
};
