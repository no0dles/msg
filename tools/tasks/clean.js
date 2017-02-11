module.exports = function (gulp, packages) {
  const cleanSources = packages.map(function (package) {
    return 'clean:source:' + package.name
  });

  const cleanBuilds = packages.map(function (package) {
    return 'clean:build:' + package.name
  });

  gulp.task('clean:source', cleanSources);
  gulp.task('clean:build', cleanBuilds);
  gulp.task('clean', cleanSources.concat(cleanBuilds));
};
