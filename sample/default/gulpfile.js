var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var ts = require('gulp-typescript')
var less = require('gulp-less')
var watch = require('gulp-watch')
var livereload = require('gulp-livereload')

//watch
gulp.task('default',function (){
    gulp.watch('src/**/*',['build'])
})

//build
gulp.task('build',['js','css'])

//js
gulp.task('js',function (){
    //ts
    gulp.src('src/js/**/*.ts')
        .pipe(ts()).js
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
    //es6
})

//css
gulp.task('css',function (){
    //less
    gulp.src('src/css/**/*.less')
        .pipe(less())
        .pipe(uglify())
        .pipe(gulp.dest('dist/css'))
})
