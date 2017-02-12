const gulp = require('gulp');
const fs = require('fs');
const path = require('path');

const packages = require('./tools/packages.json');

for(var i = 0; i < packages.length; i++) {
  packages[i].sourcePath = path.join(__dirname, 'packages', packages[i].name);
  packages[i].buildPath = path.join(__dirname, 'dist', packages[i].name);
}

const taskDir = path.join(__dirname, 'tools/tasks');
const tasks = fs.readdirSync(taskDir);

for(var i = 0; i < tasks.length; i++) {
  const task = tasks[i];
  const module = require(path.join(taskDir, task));

  if(task.endsWith('packages.js')) {
    module(gulp, packages);
  } else if(task.endsWith('package.js')) {
    for(var j = 0; j < packages.length; j++) {
      module(gulp, packages[j]);
    }
  }
}
