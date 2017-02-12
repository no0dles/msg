const spawn = require('child_process').spawn;

module.exports = function (gulp, package) {
  const options = {
    cwd: package.sourcePath,
    stdio: 'inherit'
  };

  gulp.task('build:source:' + package.name, [], function (done) {
    spawn('node_modules/.bin/tsc', ['-p', 'tsconfig.json'], options)
      .on('close', done);
  });
};
