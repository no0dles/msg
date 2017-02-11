const spawn = require('child_process').spawn;

module.exports = function (gulp, package) {
  const options = {
    cwd: package.buildPath,
    stdio: 'inherit'
  };

  gulp.task('install:build:' + package.name, [], function (done) {
    spawn('npm', ['install'], options)
      .on('close', done);
  });
};
