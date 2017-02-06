const path = require('path');

const packagesPath = path.join(__dirname, '..', 'packages');
const buildPath = path.join(__dirname, '..', 'dist');

const names = ['core', 'message', 'node', 'http', 'agent', 'scheduler', 'webhook'];
const dependencies = {
  'core': [],
  'message': ['core'],
  'node': ['core', 'message'],
  'http': ['core', 'message', 'node'],
  'agent': ['core', 'node'],
  'scheduler': [],
  'webhook': ['core', 'http']
};

module.exports.getDependency = function (package) {
  return dependencies[package];
};

module.exports.getPath = function (package) {
  return path.join(packagesPath, package);
};

module.exports.getBuildPath = function (package) {
  return path.join(buildPath, package);
};

module.exports.packagesPath = packagesPath;
module.exports.buildPath = buildPath;
module.exports.names = names;