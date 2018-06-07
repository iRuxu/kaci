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
const run = require('run-sequence');

const rename = require("gulp-rename");
const concatfile = require("gulp-concat");
const del = require("del");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();

//Config================================================

//base
const CONF = require("./kaci.config.js")
const LOCALHOST = CONF.build.default.path.root;

//scheme
var SCHEME = CONF.build.default;

//source
let SRC = CONF.source.root;
let SRC_HTML = CONF.source.html;
let SRC_CSS = CONF.source.css;
let SRC_JS = CONF.source.js;
let SRC_IMG = CONF.source.img;
let SRC_DATA = CONF.source.data;

//Basic Task===================================================

//template task
const htmlmin = require("gulp-htmlmin");
const handlebars = require("gulp-compile-handlebars");
gulp.task("template", function() {
    //忽略被处理的模板文件
    let ignore_files = [];
    SCHEME.html.ignore.forEach(function(name, i) {
        ignore_files.push("!" + __path(SRC_HTML, name));
    });

    //编译模板
    let baseURL = SCHEME.url;
    let hbsfiles = gulp
        .src([__path(SRC_HTML, "**/*.hbs"), ...ignore_files])
        .pipe(handlebars(baseURL, SCHEME.html.handlebars))
        .pipe(rename({ extname: ".html" }));
    //TODO: register -> import 、 repeat
    let htmlfiles = gulp.src([__path(SRC_HTML, "**/*.html"), ...ignore_files]);

    //打包模板
    let templatefiles = [];
    templatefiles.push(hbsfiles, htmlfiles);
    templatefiles.forEach(function(templatefile, i) {
        templatefile
            .pipe(cache("template"))
            //TODO: 合并css、js模块
            //compress
            .pipe(
                gulpif(SCHEME.html.compress, htmlmin(SCHEME.html.minifier))
            )
            //output
            .pipe(remember("template"))
            .pipe(gulp.dest(SCHEME.path.html));
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
    SCHEME.css.ignore.forEach(function(name, i) {
        ignore_files.push("!" + __path(SRC_CSS, name));
    });
    //编译less、sass
    let lessfiles = gulp
        .src([__path(SRC_CSS, "**/*.less"), ...ignore_files])
        .pipe(less(SCHEME.css.less));
    //TODO:csslab
    let sassfiles = gulp
        .src([
            __path(SRC_CSS, "**/*.sass"),
            __path(SRC_CSS, "**/*.scss"),
            ...ignore_files
        ])
        .pipe(sass(SCHEME.css.sass));
    let cssfiles = gulp.src(__path(SRC_CSS, "**/*.css"));
    //打包样式
    let stylefiles = [];
    stylefiles.push(lessfiles, sassfiles, cssfiles);
    stylefiles.forEach(function(stylefile, i) {
        stylefile
            .pipe(cache("style"))
            //autoprefix
            .pipe(autoprefixer(SCHEME.css.autoprefixer))
            //compress
            .pipe(gulpif(SCHEME.css.compress, cleancss(SCHEME.css.clean)))
            //soucemap
            .pipe(gulpif(SCHEME.css.sourcemap, sourcemaps.init()))
            .pipe(gulpif(SCHEME.css.sourcemap, sourcemaps.write("maps")))
            //output
            .pipe(remember("style"))
            .pipe(gulp.dest(SCHEME.path.css));
    });
});

//js task
const ts = require("gulp-typescript");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
gulp.task("script", function() {
    //忽略被处理的模板文件
    let ignore_files = [];
    SCHEME.js.ignore.forEach(function(name, i) {
        ignore_files.push("!" + __path(SRC_JS, name));
    });
    //编译es6、ts
    let es6files = gulp
        .src([__path(SRC_JS, "**/*.js"), ...ignore_files])
        .pipe(babel(SCHEME.js.babel));
    let tsfiles = gulp
        .src([__path(SRC_JS, "**/*.ts"), ...ignore_files])
        .pipe(ts(SCHEME.js.typescript));
    //打包js
    let jsfiles = [];
    jsfiles.push(es6files, tsfiles);
    jsfiles.forEach(function(jsfile, i) {
        jsfile
            .pipe(cache("script"))
            //compress
            .pipe(gulpif(SCHEME.js.compress, uglify()))
            //soucemap
            .pipe(gulpif(SCHEME.js.sourcemap, sourcemaps.init()))
            .pipe(gulpif(SCHEME.js.sourcemap, sourcemaps.write("maps")))
            //output
            .pipe(remember("script"))
            .pipe(gulp.dest(SCHEME.path.js));
    });
});

//img task
const imgmin = require("gulp-imagemin");
gulp.task("img", function() {
    //忽略临时图片文件
    let ignore_files = [];
    SCHEME.img.ignore.forEach(function(name, i) {
        ignore_files.push("!" + __path(SRC_IMG, name));
    });
    //打包图片
    gulp.src([__path(SRC_IMG, "**/*"), ...ignore_files])
        .pipe(cache("img"))
        //TODO:雪碧图、优化
        //output
        .pipe(remember("img"))
        .pipe(gulp.dest(SCHEME.path.img));
});

//data task
const jsonlint = require("gulp-jsonlint");
gulp.task("data", function() {
    //忽略处理本地测试数据
    let ignore_files = [];
    SCHEME.data.ignore.forEach(function(name, i) {
        ignore_files.push("!" + __path(SRC_DATA, name));
    });
    //打包验证数据文件
    let json_reporter = function(file) {
        console.log(
            __warn(`JSON文件错误：`),
            __tip(`${file.path}`),
            __warn(`请检查双引号、逗号、分号`)
        );
    };
    gulp.src([__path(SRC_DATA, "**/*"), ...ignore_files])
        .pipe(cache("data"))
        //Lint
        .pipe(jsonlint())
        .pipe(jsonlint.reporter(json_reporter))
        //output
        .pipe(remember("data"))
        .pipe(gulp.dest(SCHEME.path.data));
});

//default task
gulp.task("default", ["template", "style", "script", "img", "data"]);

//Event Task===================================================

//server
gulp.task("server", ["default"], function() {

    //获取当前指定端口
    let custom_port = process.argv[3].slice(2)

    //添加本地服务
    //https://browsersync.io/docs/options
    let server_config = {
        notify: false,
        open: false,
        server: {
            baseDir: LOCALHOST,
            directory: true
        },
        port: custom_port
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

//build -> 默认production方案
gulp.task("build", function() {

    //获取当前build模式
    let build_mode = process.argv[3].slice(2)

    try{
        //重设scheme指向
        SCHEME = CONF.build[build_mode]

        //清空build目录
        let del_files = SCHEME.path.root + '/**'
        del.sync([del_files])

        //重新打包
        run('default')
        console.log(__ok('\u2714\0\0success : 打包完成'))

    }catch(e){
        //有可能执行了一个不存在的模式
        console.log(__warn('\u2718\0\0fail : 指定的build模式不存在或未配置'))
    }

});