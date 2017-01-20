const path = require('path');

const packagesPath = path.join(__dirname, '..', 'packages');
const packages = ['core', 'agent', 'node', 'http', 'scheduler'];

module.exports.getPath = function (package) {
  return path.join(packagesPath, package);
};

module.exports.packagesPath = packagesPath;
module.exports.packages = packages;