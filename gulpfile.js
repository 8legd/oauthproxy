var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ lazy: false });

var ci = true; // Default to continuous integration mode

function handleError(err) {
  if (ci) {
    process.exit(1); // Exit on error for continuous integration
  } else {
	this.emit('end'); // Run with errors for local dev.
  }
}

gulp.task('test', function() {
    return gulp.src('**/*.test.js', { read: false })
      .pipe($.mocha({reporter: 'mocha-better-spec-reporter'})
	  .on("error", handleError)
  	);
});

gulp.task('build', function() {
  // TODO
});


gulp.task('ci', ['test','build']);