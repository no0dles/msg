module.exports = function (gulp, packages) {
  const watch = packages.map(function (package) {
    return 'watch:' + package.name
  });

  gulp.task('watch', watch);
};
