const spawn = require('child_process').spawn;

module.exports = function (gulp, package) {
  gulp.task('publish:' + package.name, function (done) {
    const options = {
      cwd: package.buildPath,
      stdio: 'inherit'
    };

    spawn('npm', ['publish', '--access=public'], options)
      .on('close', done);
  });
};
