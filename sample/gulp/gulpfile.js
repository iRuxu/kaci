//Dependencies==========================================

const path = require("path");
let __path = path.join;
//const fs = require("fs");

const gulp = require("gulp");
const gulpif = require("gulp-if");
const cache = require("gulp-cached");
const remember = require("gulp-remember");
const run = require('run-sequence');

const rename = require("gulp-rename");
const plumber = require('gulp-plumber');
//const concat = require("gulp-concat");
const del = require("del");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const lodash = require("lodash");

//Config================================================

//base
const CONF = require("./kaci.config.js");
let SRC = CONF.source.root;
const LOCALHOST = CONF.build.development.path.root;

//scheme
const DEVELOPMENT = CONF.build.development
var SCHEME;
var scheme_status = 'development';

//Basic Task===================================================

//template task
const htmlmin = require("gulp-htmlmin");
const handlebars = require("gulp-compile-handlebars");
gulp.task("template", function() {

    //忽略被处理的模板文件
    let ignore_files = [];
    SCHEME.html.ignore.forEach(function(name, i) {
        ignore_files.push("!" + __path(SRC,CONF.source.html, name));
    });

    //编译模板
    let global = SCHEME.global;
    let hbsfiles = gulp
        .src([__path(SRC,CONF.source.html, "**/*.hbs"), ...ignore_files])
        .pipe(plumber())
        .pipe(handlebars(global, {
            batch: [__path(SRC,CONF.source.hbsmod)]
        }))
        .pipe(rename({ extname: ".html" }));
    let htmlfiles = gulp.src([__path(SRC,CONF.source.html, "**/*.html"), ...ignore_files]);

    //打包模板
    let templatefiles = [];
    templatefiles.push(hbsfiles, htmlfiles);
    templatefiles.forEach(function(templatefile, i) {
        templatefile
            .pipe(cache("template"))
            //compress
            .pipe(gulpif(SCHEME.html.compress, htmlmin(SCHEME.html.minifier)))
            //output
            .pipe(remember("template"))
            .pipe(gulp.dest(__path(SCHEME.path.root,SCHEME.path.html)))
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
        ignore_files.push("!" + __path(SRC,CONF.source.css, name));
    });
    //编译less、sass
    let lessfiles = gulp
        .src([__path(SRC,CONF.source.css, "**/*.less"), ...ignore_files])
        .pipe(plumber())
        .pipe(less(SCHEME.css.less));
    let sassfiles = gulp
        .src([
            __path(SRC,CONF.source.css, "**/*.sass"),
            __path(SRC,CONF.source.css, "**/*.scss"),
            ...ignore_files
        ])
        .pipe(plumber())
        .pipe(sass(SCHEME.css.sass));
    let cssfiles = gulp.src(__path(SRC,CONF.source.css, "**/*.css"));
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
            .pipe(gulp.dest(__path(SCHEME.path.root,SCHEME.path.css)));
    });
});

//js task
const ts = require("gulp-typescript");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
gulp.task("script", function() {
    //使用webpack打包时
    if(CONF.webpack){

        //独立处理lib文件 
        gulp.src([__path(SRC,CONF.source.jslib, "**/*")])
            .pipe(gulpif(SCHEME.js.compress, uglify()))
            .pipe(gulp.dest(__path(SCHEME.path.root,SCHEME.path.jslib)));

        if(scheme_status=='development'){
            webpack(webpackConfig[0]).run();
        }else if(scheme_status=='production'){
            webpack(webpackConfig[1]).run()
        }else{
            let custom_diff = {
                output:{
                    path:path.resolve(__dirname,CONF.build[scheme_status].path.js)
                }
            }
            let custom_config = lodash.merge({},webpackConfig[1],custom_webpack_config)
            webpack(custom_config).run()
        }
    //使用传统方案时
    }else{
        //忽略被处理的模板文件
        let ignore_files = [];
        SCHEME.js.ignore.forEach(function(name, i) {
            ignore_files.push("!" + __path(SRC,CONF.source.js, name));
        });
        //编译es6、ts
        let es6files = gulp
            .src([__path(SRC,CONF.source.js, "**/*.js"), ...ignore_files])
            .pipe(plumber())
            .pipe(babel(SCHEME.js.babel));
        let tsfiles = gulp
            .src([__path(SRC,CONF.source.js, "**/*.ts"), ...ignore_files])
            .pipe(plumber())
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
                .pipe(gulp.dest(__path(SCHEME.path.root,SCHEME.path.js)));
        });
    }
});

//img task
gulp.task("img", function() {
    //忽略临时图片文件
    let ignore_files = [];
    SCHEME.img.ignore.forEach(function(name, i) {
        ignore_files.push("!" + __path(SRC,CONF.source.img, name));
    });
    //打包图片
    gulp.src([__path(SRC,CONF.source.img, "**/*"), ...ignore_files])
        .pipe(cache("img"))
        .pipe(plumber())
        //output
        .pipe(remember("img"))
        .pipe(gulp.dest(__path(SCHEME.path.root,SCHEME.path.img)));
});

//data task
const jsonlint = require("gulp-jsonlint");
gulp.task("data", function() {
    //忽略处理本地测试数据
    let ignore_files = [];
    SCHEME.data.ignore.forEach(function(name, i) {
        ignore_files.push("!" + __path(SRC,CONF.source.data, name));
    });
    //打包验证数据文件
    let json_reporter = function(file) {
        console.error(`JSON文件错误：${file.path}，请检查双引号、逗号、分号`)
    };
    gulp.src([__path(SRC,CONF.source.data, "**/*"), ...ignore_files])
        .pipe(cache("data"))
        .pipe(plumber())
        //Lint
        .pipe(jsonlint())
        .pipe(jsonlint.reporter(json_reporter))
        //output
        .pipe(remember("data"))
        .pipe(gulp.dest(__path(SCHEME.path.root,SCHEME.path.data)));
});

//default task
gulp.task("default", ["template", "style", "script","img", "data"]);

//Event Task===================================================

//server
gulp.task("server", function() {
    //获取当前指定端口
    let custom_port = parseInt(Math.abs(process.argv[3].slice(2)))
    if(isNaN(custom_port)){
        console.error('\u00d7\0\0error : 指定的端口必须为一个整数')
        return
    }
    //添加本地服务
    let server_config = {
        notify: false,
        open: CONF.server.open,
        server: {
            baseDir: LOCALHOST,
            directory: true
        },
        port: custom_port
    };
    browserSync.init(server_config);
    console.log('\u2714\0\0success : 本地服务运行中..')
});

//reload
gulp.task("reload", function() {
    browserSync.reload();
});

//start
gulp.task("start", function() {

    //设置本地服务方案
    scheme_status = 'development'
    SCHEME = DEVELOPMENT; 

    //执行默认任务与启动本地服务
    run('default','server')

    //忽略不被监听的文件
    let watch_files = __path(SRC, "**/*");
    let ignore_files = [];
    SCHEME.ignore.forEach(function(name, i) {
        ignore_files.push("!" + __path(SRC, name));
    });

    //监听与自动刷新
    gulp.watch([watch_files, ...ignore_files], function (){
        CONF.server.reload ? run('default','reload') : run('default')
    });

});

//build
gulp.task("build", function() {

    //重设scheme指向
    scheme_status = process.argv[3].slice(2)

    if(!CONF.build[scheme_status]){
        console.error('\u00d7\0\0error : 指定的build方案不存在，请检查kaci.config.js中build配置项')
        return
    }
    let current_scheme = lodash.merge({},DEVELOPMENT,CONF.build[scheme_status])
    SCHEME = current_scheme

    //清空打包目录
    let del_files = SCHEME.path.root + '/**'
    del.sync([del_files])

    //重新打包
    run('default')
    console.log('\u2714\0\0success : build 完成 =>',__path(__dirname,SCHEME.path.root))

});