module.exports = function (gulp, packages) {
  const cleanBuilds = packages.map(function (package) {
    return 'clean:build:' + package.name
  });

  gulp.task('clean:build', cleanBuilds);
};
