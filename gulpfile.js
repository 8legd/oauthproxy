var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ lazy: false });


gulp.task('test-libs', function() {
    return gulp.src('lib/**/*.test.js', { read: false }) // Don't read file contents just pipe files to mocha
        .pipe($.mocha({reporter: 'mocha-better-spec-reporter'})
  	);
});
gulp.task('test-app', ['test-libs'], function() { // Dependency on libs test to pass first
    return gulp.src('*.test.js', { read: false }) // Don't read file contents just pipe files to mocha
        .pipe($.mocha({reporter: 'mocha-better-spec-reporter'})
    );
});
//gulp.task('test', ['test-libs','test-app']);
gulp.task('test', ['test-libs']);

gulp.task('build', function() {
  // TODO
});

gulp.task('ci', ['test','build']);