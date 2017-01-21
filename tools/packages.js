const path = require('path');

const packagesPath = path.join(__dirname, '..', 'packages');
const buildPath = path.join(__dirname, '..', 'dist');

const names = ['core', 'agent', 'node', 'http', 'scheduler'];

module.exports.getPath = function (package) {
  return path.join(packagesPath, package);
};

module.exports.getBuildPath = function (package) {
  return path.join(buildPath, package);
};

module.exports.packagesPath = packagesPath;
module.exports.buildPath = buildPath;
module.exports.names = names;