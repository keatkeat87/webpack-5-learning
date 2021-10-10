const gulp = require('gulp');
const inlineCss = require('gulp-inline-css');

gulp.task('inlineCss', () => {
  return gulp
    .src('./EmailTemplate/**/Index.cshtml')
    .pipe(
      inlineCss({
        removeHtmlSelectors: true,
      })
    )
    .pipe(gulp.dest('./EmailTemplate'));
});
