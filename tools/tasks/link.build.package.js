const spawn = require('child_process').spawn;

module.exports = function (gulp, package) {
  const options = {
    cwd: package.buildPath,
    stdio: 'inherit'
  };

  gulp.task('link:build:' + package.name, [], function (done) {
    spawn('npm', ['link'], options)
      .on('close', done);
  });
};
