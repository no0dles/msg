const gulp = require('gulp');
const build = require('./tools/build');
const test = require('./tools/test');
const install = require('./tools/install');
const packages = require('./tools/packages');

function bundle(task) {
  gulp.task(task, packages.names.map(function(package) { return task + '-' + package }));
}

for(var i = 0; i < packages.names.length; i++) {
  var package = packages.names[i];

  gulp.task('install-' + package, install.run(package));

  gulp.task('build-install-' + package, install.runInBuild(package));
  gulp.task('build-ts-' + package, build.buildSource(package));
  gulp.task('build-test-ts-' + package, build.buildTest(package));
  gulp.task('build-npm-' + package, build.buildPackage(package));
  gulp.task('build-' + package, ['build-ts-' + package, 'build-npm-' + package]);
  gulp.task('watch-' + package, build.watchSource(package));
  //gulp.task('bump-' + package, bumpPackage(package));
  gulp.task('test-' + package, ['build-test-ts-' + package], test.run(package));
  //gulp.task('publish-' + package, ['bump-' + package], publishPackage(package));
}

bundle('install');
bundle('test');

bundle('watch');
bundle('build');
bundle('build-install');
bundle('build-ts');
bundle('build-test-ts');
bundle('build-npm');

//bundle('publish');
