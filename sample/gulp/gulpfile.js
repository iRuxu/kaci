//public dependencies
const path = require("path");
let __path = path.join
const fs = require("fs");

//const declaration
const CONF = require(__path(__dirname, "config.js"));
const SCHEME = CONF.build.default;  //TODO:build模式修改对应scheme
const CONF_JS = SCHEME.js;
const CONF_CSS = SCHEME.css;
const CONF_HTML = SCHEME.html;

//path cache
let path_root = __path(__dirname);
let path_js_src = __path(__dirname,CONF.srcPath.js)
let path_js_dist = __path(__dirname,CONF.distPath.js)
let path_css_src = __path(__dirname,CONF.srcPath.css)
let path_css_dist = __path(__dirname,CONF.distPath.css)
let path_html_src = __path(__dirname,CONF.srcPath.html)
let path_html_dist = __path(__dirname,CONF.distPath.html)

//local dependencies
const gulp = require("gulp");
const gulpif = require("gulp-if");
const sourcemaps = require("gulp-sourcemaps");
const livereload = require("gulp-livereload");
const run = require("run-sequence").use(gulp);

//template task
const handlebars = require('gulp-handlebars');
const htmlmin = require('gulp-htmlmin');
const globaldata = SCHEME.global
gulp.task('template',['hbs','html'])
gulp.task('hbs',function (){
    gulp.src(__path(path_html_src,"**/*.hbs"))
        //hbs
        //TODO:工作流
        .pipe(/* handlebars({compiler:function (){
            console.log(this)
            console.log(globaldata)
        }}) */)
        //compress
        .pipe(gulpif(CONF_HTML.compress, htmlmin(CONF_HTML.minifier)))
        //output
        .pipe(gulp.dest(path_html_dist))
        //livereload
        .pipe(livereload());
})
gulp.task('html',function (){
    gulp.src(__path(path_html_src,"**/*.html"))
        //compress
        .pipe(gulpif(CONF_HTML.compress, htmlmin(CONF_HTML.minifier)))
        //output
        .pipe(gulp.dest(path_html_dist))
        //livereload
        .pipe(livereload());
})

//style task
const less = require("gulp-less");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const cleancss = require("gulp-clean-css");
let ignore_css_files = [];
CONF_CSS.ignore.forEach(function(name, i) {
    ignore_css_files.push("!" + __path(path_css_src,name));
});
gulp.task('style',['less','sass','css'])
gulp.task("less", function() {
    gulp.src([__path(path_css_src, "**/*.less"), ...ignore_css_files])
        //TODO:csslab
        //less
        .pipe(less(CONF_CSS.less))
        //autoprefix
        .pipe(autoprefixer(CONF_CSS.autoprefixer))
        //compress
        .pipe(gulpif(CONF_CSS.compress, cleancss(CONF_CSS.clean)))
        //soucemap
        .pipe(gulpif(CONF_CSS.sourcemap, sourcemaps.init()))
        .pipe(gulpif(CONF_CSS.sourcemap, sourcemaps.write("maps")))
        //output
        .pipe(gulp.dest(path_css_dist))
        //livereload
        .pipe(livereload());
});
gulp.task("sass", function() {
    gulp.src([
        __path(path_css_src, "**/*.sass"),
        __path(path_css_src, "**/*.scss"),
        ...ignore_css_files
    ])
        //less
        .pipe(sass(CONF_CSS.sass))
        //autoprefix
        .pipe(autoprefixer(CONF_CSS.autoprefixer))
        //compress
        .pipe(gulpif(CONF_CSS.compress, cleancss(CONF_CSS.clean)))
        //soucemap
        .pipe(gulpif(CONF_CSS.sourcemap, sourcemaps.init()))
        .pipe(gulpif(CONF_CSS.sourcemap, sourcemaps.write("maps")))
        //output
        .pipe(gulp.dest(path_css_dist))
        //livereload
        .pipe(livereload());
});
gulp.task("css", function() {
    gulp.src(__path(path_css_src,"**/*.css"))
        //autoprefix
        .pipe(autoprefixer(CONF_CSS.autoprefixer))
        //compress
        .pipe(gulpif(CONF_CSS.compress, cleancss(CONF_CSS.clean)))
        //soucemap
        .pipe(gulpif(CONF_CSS.sourcemap, sourcemaps.init()))
        .pipe(gulpif(CONF_CSS.sourcemap, sourcemaps.write("maps")))
        //output
        .pipe(gulp.dest(path_css_dist))
        //livereload
        .pipe(livereload());
});

//js task
const ts = require("gulp-typescript");
const uglify = require("gulp-uglify");
gulp.task("js", function() {
    gulp.src(__path(path_js_src,"**/*"))
        //ts
        .pipe(ts(CONF_JS.typescript))
        //compress
        .pipe(gulpif(CONF_JS.compress, uglify()))
        //soucemap
        .pipe(gulpif(CONF_JS.sourcemap, sourcemaps.init()))
        .pipe(gulpif(CONF_JS.sourcemap, sourcemaps.write("maps")))
        //output
        .pipe(gulp.dest(path_js_dist))
        //livereload
        .pipe(livereload()); //TODO:
});

//img task

//data task

//default task
gulp.task('default',['template','style','js'])

//watch
let watchfiles = __path(CONF.srcPath.root, "**/*");
let ignorefiles = []
SCHEME.ignore.forEach(function(name, i) {
    ignorefiles.push("!" + __path(CONF.srcPath.root,name));
});
gulp.watch([watchfiles, ...ignorefiles], ["default"]);





/* gulp.task("jscompile", function() {
    TODO:css  js 模块合并
    /* var concat = require('gulp-concat')
}); */
