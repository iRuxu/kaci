//Dependencies==========================================

//public dependencies
const path = require("path");
let __path = path.join;
const fs = require("fs");
const chalk = require("chalk");
let __warn = chalk.redBright;
let __tip = chalk.yellowBright;
let __ok = chalk.greenBright;

//local dependencies
const gulp = require("gulp");
const gulpif = require("gulp-if");
const cache = require("gulp-cached");
const remember = require("gulp-remember");

const rename = require("gulp-rename");
const concatfile = require("gulp-concat");
const del = require("del");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();

//Config================================================

//scheme
const CONF = require("./kaci.config.js");
const LOCALHOST = CONF.build.default.path.root;
let SCHEME = CONF.build.default;

//setting
let JS_SETTINGS = SCHEME.js;
let CSS_SETTINGS = SCHEME.css;
let HTML_SETTINGS = SCHEME.html;
let IMG_SETTINGS = SCHEME.img;
let DATA_SETTINGS = SCHEME.data;
let ROOT_URL = SCHEME.url;

//path
let SRC = CONF.source.root;
let HTML_SRC = CONF.source.html;
let CSS_SRC = CONF.source.css;
let JS_SRC = CONF.source.js;
let IMG_SRC = CONF.source.img;
let DATA_SRC = CONF.source.data;

let DIST = SCHEME.path.root;
let HTML_DIST = SCHEME.path.html;
let CSS_DIST = SCHEME.path.css;
let JS_DIST = SCHEME.path.js;
let IMG_DIST = SCHEME.path.img;
let DATA_DIST = SCHEME.path.data;

//Basic Task===================================================

//template task
const htmlmin = require("gulp-htmlmin");
const handlebars = require("gulp-compile-handlebars");
gulp.task("template", function() {
    //忽略被处理的模板文件
    let ignore_files = [];
    HTML_SETTINGS.ignore.forEach(function(name, i) {
        ignore_files.push("!" + __path(HTML_SRC, name));
    });

    //编译模板
    let baseURL = SCHEME.url;
    let hbsfiles = gulp
        .src([__path(HTML_SRC, "**/*.hbs"), ...ignore_files])
        .pipe(handlebars(baseURL, SCHEME.html.handlebars))
        .pipe(rename({ extname: ".html" }));
    //TODO: register -> import 、 repeat
    let htmlfiles = gulp.src([__path(HTML_SRC, "**/*.html"), ...ignore_files]);

    //打包模板
    let templatefiles = [];
    templatefiles.push(hbsfiles, htmlfiles);
    templatefiles.forEach(function(templatefile, i) {
        templatefile
            .pipe(cache("template"))
            //TODO: 合并css、js模块
            //compress
            .pipe(
                gulpif(HTML_SETTINGS.compress, htmlmin(HTML_SETTINGS.minifier))
            )
            //output
            .pipe(remember("template"))
            .pipe(gulp.dest(HTML_DIST));
    });
});

//style task
const less = require("gulp-less");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const cleancss = require("gulp-clean-css");
gulp.task("style", function() {
    //忽略被处理的模板文件
    let ignore_files = [];
    CSS_SETTINGS.ignore.forEach(function(name, i) {
        ignore_files.push("!" + __path(CSS_SRC, name));
    });
    //编译less、sass
    let lessfiles = gulp
        .src([__path(CSS_SRC, "**/*.less"), ...ignore_files])
        .pipe(less(CSS_SETTINGS.less));
    //TODO:csslab
    let sassfiles = gulp
        .src([
            __path(CSS_SRC, "**/*.sass"),
            __path(CSS_SRC, "**/*.scss"),
            ...ignore_files
        ])
        .pipe(sass(CSS_SETTINGS.sass));
    let cssfiles = gulp.src(__path(CSS_SRC, "**/*.css"));
    //打包样式
    let stylefiles = [];
    stylefiles.push(lessfiles, sassfiles, cssfiles);
    stylefiles.forEach(function(stylefile, i) {
        stylefile
            .pipe(cache("style"))
            //autoprefix
            .pipe(autoprefixer(CSS_SETTINGS.autoprefixer))
            //compress
            .pipe(gulpif(CSS_SETTINGS.compress, cleancss(CSS_SETTINGS.clean)))
            //soucemap
            .pipe(gulpif(CSS_SETTINGS.sourcemap, sourcemaps.init()))
            .pipe(gulpif(CSS_SETTINGS.sourcemap, sourcemaps.write("maps")))
            //output
            .pipe(remember("style"))
            .pipe(gulp.dest(CSS_DIST));
    });
});

//js task
const ts = require("gulp-typescript");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
gulp.task("script", function() {
    //忽略被处理的模板文件
    let ignore_files = [];
    JS_SETTINGS.ignore.forEach(function(name, i) {
        ignore_files.push("!" + __path(JS_SRC, name));
    });
    //编译es6、ts
    let es6files = gulp
        .src([__path(JS_SRC, "**/*.js"), ...ignore_files])
        .pipe(babel(JS_SETTINGS.babel));
    let tsfiles = gulp
        .src([__path(JS_SRC, "**/*.ts"), ...ignore_files])
        .pipe(ts(JS_SETTINGS.typescript));
    //打包js
    let jsfiles = [];
    jsfiles.push(es6files, tsfiles);
    jsfiles.forEach(function(jsfile, i) {
        jsfile
            .pipe(cache("script"))
            //compress
            .pipe(gulpif(JS_SETTINGS.compress, uglify()))
            //soucemap
            .pipe(gulpif(JS_SETTINGS.sourcemap, sourcemaps.init()))
            .pipe(gulpif(JS_SETTINGS.sourcemap, sourcemaps.write("maps")))
            //output
            .pipe(remember("script"))
            .pipe(gulp.dest(JS_DIST));
    });
});

//img task
const imgmin = require("gulp-imagemin");
gulp.task("img", function() {
    //忽略临时图片文件
    let ignore_files = [];
    IMG_SETTINGS.ignore.forEach(function(name, i) {
        ignore_files.push("!" + __path(IMG_SRC, name));
    });
    //打包图片
    gulp.src([__path(IMG_SRC, "**/*"), ...ignore_files])
        .pipe(cache("img"))
        //TODO:雪碧图、优化
        //output
        .pipe(remember("img"))
        .pipe(gulp.dest(IMG_DIST));
});

//data task
const jsonlint = require("gulp-jsonlint");
gulp.task("data", function() {
    //忽略处理本地测试数据
    let ignore_files = [];
    DATA_SETTINGS.ignore.forEach(function(name, i) {
        ignore_files.push("!" + __path(DATA_SRC, name));
    });
    //打包验证数据文件
    let json_reporter = function(file) {
        console.log(
            __warn(`JSON文件错误：`),
            __tip(`${file.path}`),
            __warn(`请检查双引号、逗号、分号`)
        );
    };
    gulp.src([__path(DATA_SRC, "**/*"), ...ignore_files])
        .pipe(cache("data"))
        //Lint
        .pipe(jsonlint())
        .pipe(jsonlint.reporter(json_reporter))
        //output
        .pipe(remember("data"))
        .pipe(gulp.dest(DATA_DIST));
});

//default task
gulp.task("default", ["template", "style", "script", "img", "data"]);

//Event Task===================================================

//server
gulp.task("server", ["default"], function() {
    //添加本地服务
    //https://browsersync.io/docs/options
    let server_config = {
        notify: false,
        open: false,
        server: {
            baseDir: LOCALHOST,
            directory: true
        },
        port: CONF.server.port
    };
    browserSync.init(server_config);
});

//reload
gulp.task("reload", function() {
    browserSync.reload();
});

//start
gulp.task("start", ["server"], function() {
    //监察文件
    let watch_files = __path(SRC, "**/*");
    let ignore_files = [];
    SCHEME.ignore.forEach(function(name, i) {
        ignore_files.push("!" + __path(SRC, name));
    });
    //是否自动刷新
    let start_task = ["default"];
    CONF.server.reload && start_task.push("reload");
    gulp.watch([watch_files, ...ignore_files], start_task);
    console.log(__ok('\u2714\0\0success : 本地服务运行中..'))
});

//build - > 默认production方案
gulp.task("build", function() {

    SCHEME = CONF.build.production
    //清空build目录
    let del_files = CONF.build.production.path.root + '/**'

});

//特殊方案