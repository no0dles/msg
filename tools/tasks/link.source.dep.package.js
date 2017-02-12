const spawn = require('child_process').spawn;
const sequence = require('gulp-sequence');

function linkDep(gulp, package, dependency) {
  const options = {
    cwd: package.sourcePath,
    stdio: 'inherit'
  };

  gulp.task('link:source:dep:' + package.name + ':' + dependency, [], function (done) {
    spawn('npm', ['link', '@msg/' + dependency], options)
      .on('close', done);
  });
}

module.exports = function (gulp, package) {
  const tasks = [];

  for (var i = 0; i < package.dependencies.length; i++) {
    linkDep(gulp, package, package.dependencies[i]);
    tasks.push('link:source:dep:' + package.name + ':' + package.dependencies[i]);
  }

  var fn;
  if(tasks.length > 0) {
    fn = sequence.apply(this, tasks);
  } else {
    fn = function () { };
  }

  gulp.task('link:source:dep:' + package.name, fn);
};
