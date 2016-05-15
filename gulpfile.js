var gulp = require('gulp');
var concatFile = require('gulp-concat');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
gulp.task('bundle', function() {
    console.log('bundle Working!');
    return gulp.src(['./static/javascripts/{account,authentication,layout,components,word}/**/*.js', 
        './static/javascripts/{app,app.routes,require}.js'])
        .pipe(concatFile("main.js", {newLine: ','}))
        .pipe(gulp.dest('./static/javascripts/'));
});


gulp.task('watch', function () {
    watch('./static/javascripts/**/*.js', function(){
        gulp.start('bundle')
    });
});
gulp.task('default', ['watch'])