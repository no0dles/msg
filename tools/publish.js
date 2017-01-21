const spawn = require('./spawn');

function publishPackage(package) {
  return spawn.run(package, 'npm', ['publish', '--access=public']);
}