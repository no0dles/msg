const gulp = require('gulp');
const path = require('path');

const clean = require('./tools/tasks/clean.packages');
const cleanSource = require('./tools/tasks/clean.source.packages');
const buildSource = require('./tools/tasks/clean.build.packages');
const build = require('./tools/tasks/build.packages');
const test = require('./tools/tasks/test.packages');
const bump = require('./tools/tasks/bump.packages.js');
const watch = require('./tools/tasks/watch.packages');
const init = require('./tools/tasks/init.packages');
const publish = require('./tools/tasks/publish.packages');
const npmPublish = require('./tools/tasks/publish.npm.packages');
const runTest = require('./tools/tasks/run.test.packages');
const installSource = require('./tools/tasks/install.source.packages');

const cleanBuildPackage = require('./tools/tasks/clean.build.package.js');
const cleanSourcePackage = require('./tools/tasks/clean.source.package.js');
const installBuildPackage = require('./tools/tasks/install.build.package.js');
const buildNpmPackage = require('./tools/tasks/build.npm.package.js');
const buildSourcePackage = require('./tools/tasks/build.source.package.js');
const buildTestPackage = require('./tools/tasks/build.test.package.js');
const linkBuildPackage = require('./tools/tasks/link.build.package.js');
const linkSourceDepPackage = require('./tools/tasks/link.source.dep.package.js');
const testPackage = require('./tools/tasks/test.package.js');
const publishNpmPackage = require('./tools/tasks/publish.npm.package.js');
const publishNpm = require('./tools/tasks/publish.npm.packages.js');
const watchPackage = require('./tools/tasks/watch.package.js');
const buildPackage = require('./tools/tasks/build.package.js');
const initPackage = require('./tools/tasks/init.package.js');
const npmPublishPackage = require('./tools/tasks/publish.npm.package');
const runTestPackage = require('./tools/tasks/run.test.package');

const packages = require('./tools/packages.json');

for(var i = 0; i < packages.length; i++) {
  packages[i].sourcePath = path.join(__dirname, 'packages', packages[i].name);
  packages[i].buildPath = path.join(__dirname, 'dist', packages[i].name);
}

for(var i = 0; i < packages.length; i++) {
  cleanBuildPackage(gulp, packages[i]);
  cleanSourcePackage(gulp, packages[i]);
  installBuildPackage(gulp, packages[i]);
  buildNpmPackage(gulp, packages[i]);
  buildSourcePackage(gulp, packages[i]);
  buildTestPackage(gulp, packages[i]);
  testPackage(gulp, packages[i]);
  linkBuildPackage(gulp, packages[i]);
  linkSourceDepPackage(gulp, packages[i]);
  publishNpmPackage(gulp, packages[i]);
  watchPackage(gulp, packages[i]);
  buildPackage(gulp, packages[i]);
  initPackage(gulp, packages[i]);
  npmPublishPackage(gulp, packages[i]);
  runTestPackage(gulp, packages[i]);
}

installSource(gulp, packages);
cleanSource(gulp, packages);
buildSource(gulp, packages);
clean(gulp, packages);
build(gulp, packages);
test(gulp, packages);
bump(gulp, packages);
runTest(gulp, packages);
npmPublish(gulp, packages);
publishNpm(gulp, packages);
watch(gulp, packages);
init(gulp, packages);


//todo: module generator
