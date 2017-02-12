module.exports = function (gulp, packages) {
  const cleanSources = packages.map(function (package) {
    return 'clean:source:' + package.name
  });
  
  gulp.task('clean:source', cleanSources);
};
