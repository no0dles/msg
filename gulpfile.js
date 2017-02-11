const gulp = require('gulp');
const path = require('path');

const clean = require('./tools/tasks/clean');
const cleanBuild = require('./tools/tasks/clean.build');
const cleanSource = require('./tools/tasks/clean.source');
const installSource = require('./tools/tasks/install.source');
const installBuild = require('./tools/tasks/install.build');
const buildPackage = require('./tools/tasks/build.package');
const buildSource = require('./tools/tasks/build.source');
const buildTest = require('./tools/tasks/build.test');
const install = require('./tools/tasks/install');
const build = require('./tools/tasks/build');
const testBuild = require('./tools/tasks/test.build');
const test = require('./tools/tasks/test');
const bumpPackage = require('./tools/tasks/bump.package');
const publishPackage = require('./tools/tasks/publish.package');
const publish = require('./tools/tasks/publish');
const watchSource = require('./tools/tasks/watch.source');
const watch = require('./tools/tasks/watch');
const packages = require('./tools/packages.json');

for(var i = 0; i < packages.length; i++) {
  packages[i].sourcePath = path.join(__dirname, 'packages', packages[i].name);
  packages[i].buildPath = path.join(__dirname, 'dist', packages[i].name);
}

for(var i = 0; i < packages.length; i++) {
  cleanBuild(gulp, packages[i]);
  cleanSource(gulp, packages[i]);
  installSource(gulp, packages[i]);
  installBuild(gulp, packages[i]);
  buildPackage(gulp, packages[i]);
  buildSource(gulp, packages[i]);
  buildTest(gulp, packages[i]);
  testBuild(gulp, packages[i]);
  publishPackage(gulp, packages[i]);
  watchSource(gulp, packages[i]);
}

install(gulp, packages);
clean(gulp, packages);
build(gulp, packages);
test(gulp, packages);
bumpPackage(gulp, packages);
publish(gulp, packages);
watch(gulp, packages);


//todo: module generator
