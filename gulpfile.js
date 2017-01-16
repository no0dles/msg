const gulp = require('gulp');
const bump = require('gulp-bump');
const mocha = require('gulp-mocha');
const spawn = require('child_process').spawn;
const path = require('path');

const packagesPath = path.join(__dirname, 'packages');
const packages = ['core', 'agent', 'node', 'http', 'scheduler'];

function bundle(task) {
  gulp.task(task, packages.map(function(package) { return task + '-' + package }));
}

function run(package, command, args) {
  return function(done) {
    var packagePath = path.join(packagesPath, package);
    var options = { cwd: packagePath, stdio: 'inherit'};

    spawn(command, args || [], options)
      .on('close', done);
  }
}

function testPackage(package) {
  return function () {
    var testFiles = path.join(packagesPath, package, '**/*.test.js');
    console.log(testFiles);
    gulp.src(testFiles, {read: false})
      .pipe(mocha({reporter: 'list'}));
  }
}


function installPackage(package) {
  return run(package, 'npm', ['install']);
}

function buildPackage(package) {
  return run(package, 'node_modules/.bin/tsc');
}

function bumpPackage(package) {
  return function() {
    var packagePath = path.join(packagesPath, package);
    var packageFile = path.join(packagePath, 'package.json');

    gulp.src(packageFile)
      .pipe(bump())
      .pipe(gulp.dest(packagePath));
  }
}

function publishPackage(package) {
  return run(package, 'npm', ['publish', '--access=public']);
}

for(var i = 0; i < packages.length; i++) {
  var package = packages[i];

  gulp.task('install-' + package, installPackage(package));
  gulp.task('build-' + package, buildPackage(package));
  gulp.task('bump-' + package, bumpPackage(package));
  gulp.task('test-' + package, testPackage(package));
  gulp.task('publish-' + package, ['bump-' + package], publishPackage(package));
}

bundle('install');
bundle('build');
bundle('publish');

gulp.task('test', function () {
  var testFiles = path.join(packagesPath, '**/*.test.js');
  gulp.src(testFiles, {read: false})
    .pipe(mocha({reporter: 'list'}));
});
