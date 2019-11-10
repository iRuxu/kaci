//base modules
const path = require("path");
const lodash = require("lodash");

//gulp modules
const gulp = require("gulp");
const cache = require("gulp-cached");
const remember = require("gulp-remember");
const plumber = require("gulp-plumber");
const gulpif = require("gulp-if");
const watch = require("gulp-watch");

//config settings
//----------------------------------
const CONF = require("./kaci.config.js");
const sourceRoot = CONF.source.root;
let SCHEME = null;
const SCHEME_MAP = {
    default: CONF.build.development,
    start: CONF.build.development,
    build: lodash.merge({}, CONF.build.development, CONF.build.production) //缺省设置使用dev配置
};
if (!process.argv[2]) {
    SCHEME = CONF.build.development;
} else {
    SCHEME = SCHEME_MAP[process.argv[2]];
}

//Util functions
//----------------------------------
function LoadFiles(source, glob, ignore) {
    //忽略被处理的模板文件
    let ignore_files = [];
    if(ignore){
        ignore.forEach(function (name, i) {
            ignore_files.push("!" + path.join(source, name));
        });
    }

    //编译模板
    let source_stream = gulp.src(
        [path.join(source, glob), ...ignore_files], 
        {cwd: sourceRoot}
    );

    return source_stream;
}

//template task
//----------------------------------
const handlebars = require("gulp-compile-handlebars");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");

gulp.task("html", function (done) {

    //hbs文件处理
    LoadFiles(CONF.source.html,"**/*.hbs",SCHEME.html.ignore)
        .pipe(
            handlebars(
                SCHEME.vars,  //替换模板变量{{value}}
                { batch: [path.join(sourceRoot, CONF.source.hbsmod)] }  //组织submodules
            )
        )
        .pipe(plumber())
        .pipe(rename({ extname: ".html" }))
        .pipe(cache("hbs"))
        .pipe(gulpif(SCHEME.html.compress, htmlmin(SCHEME.html.minifier)))
        .pipe(remember("hbs"))
        .pipe(gulp.dest(SCHEME.path));
    
    //html文件处理
    LoadFiles(CONF.source.html,"**/*.html",SCHEME.html.ignore)
        .pipe(cache("htm"))
        .pipe(gulpif(SCHEME.html.compress, htmlmin(SCHEME.html.minifier)))
        .pipe(remember("htm"))
        .pipe(gulp.dest(SCHEME.path));

    done();
});

//style task
//----------------------------------
const less = require("gulp-less");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const cleancss = require("gulp-clean-css");

gulp.task('css',function(done) {

    let mode = CONF.build.development.css.mode
    if(mode == 'less'){
    LoadFiles(CONF.source.css,"**/*.less",SCHEME.css.ignore)
        .pipe(plumber())
        .pipe(less(SCHEME.css.less))
        .pipe(cache("less"))
        .pipe(autoprefixer(SCHEME.css.autoprefixer))
        .pipe(gulpif(SCHEME.css.compress, cleancss(SCHEME.css.clean)))
        .pipe(remember("less"))
        .pipe(gulp.dest(SCHEME.path));
    }

    if(mode == 'sass'){
    LoadFiles(CONF.source.css,"**/*.sass",SCHEME.css.ignore)
        .pipe(plumber())
        .pipe(sass(SCHEME.css.sass))
        .pipe(cache("sass"))
        .pipe(autoprefixer(SCHEME.css.autoprefixer))
        .pipe(gulpif(SCHEME.css.compress, cleancss(SCHEME.css.clean)))
        .pipe(remember("sass"))
        .pipe(gulp.dest(SCHEME.path));
    }

    LoadFiles(CONF.source.css,"**/*.css",SCHEME.css.ignore)
        .pipe(plumber())
        .pipe(cache("csss"))
        .pipe(autoprefixer(SCHEME.css.autoprefixer))
        .pipe(gulpif(SCHEME.css.compress, cleancss(SCHEME.css.clean)))
        .pipe(remember("csss"))
        .pipe(gulp.dest(SCHEME.path));

    done();
})

//javascript task
//----------------------------------
const babel = require("gulp-babel");
const ts = require("gulp-typescript");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");

gulp.task('js',function(done) {

    //独立处理lib文件，lib文件不再压缩，否则可能出现2次压缩问题
    LoadFiles(CONF.source.jslib,"**/*",SCHEME.js.ignore)
        .pipe(gulp.dest(SCHEME.path))

    //使用webpack打包时
    if (SCHEME.js.webpack) {
        if (SCHEME.name == "development") {
            webpack(webpackConfig[0]).run();
        } else if (SCHEME.name == "production") {
            webpack(webpackConfig[1]).run();
        }

    //使用传统方案时
    } else {

        LoadFiles(CONF.source.js,"**/*.js",SCHEME.js.ignore)
            .pipe(plumber())
            .pipe(babel(SCHEME.js.babel))
            .pipe(cache("js"))
            .pipe(gulpif(SCHEME.js.compress, uglify()))
            .pipe(gulpif(SCHEME.js.sourcemap, sourcemaps.init()))
            .pipe(gulpif(SCHEME.js.sourcemap, sourcemaps.write("maps")))
            .pipe(remember("js"))
            .pipe(gulp.dest(SCHEME.path))
        
        LoadFiles(CONF.source.js,"**/*.ts",SCHEME.js.ignore)
            .pipe(plumber())
            .pipe(ts(SCHEME.js.typescript))
            .pipe(cache("ts"))
            .pipe(gulpif(SCHEME.js.compress, uglify()))
            .pipe(gulpif(SCHEME.js.sourcemap, sourcemaps.init()))
            .pipe(gulpif(SCHEME.js.sourcemap, sourcemaps.write("maps")))
            .pipe(remember("ts"))
            .pipe(gulp.dest(SCHEME.path))

    }

    done();
})

//image task
//----------------------------------
gulp.task('img',function(done) {

    LoadFiles(CONF.source.img,"**/*",SCHEME.img.ignore)
        .pipe(cache("img"))
        //图片加工...
        .pipe(remember("img"))
        .pipe(gulp.dest(SCHEME.path));

    done();
})

//data task
//----------------------------------
const jsonlint = require("gulp-jsonlint");

gulp.task('data',function(done) {

    LoadFiles(CONF.source.data,"**/*",SCHEME.data.ignore)
        .pipe(cache("data"))
        .pipe(plumber())
        .pipe(jsonlint())
        .pipe(jsonlint.reporter(function (file){
            console.error(`JSON文件错误：${file.path}，请检查双引号、逗号、分号`);
        }))
        .pipe(remember("data"))
        .pipe(gulp.dest(SCHEME.path));

    done();
})

//default task
//----------------------------------
let default_tasks = [];
if (SCHEME.html.enable) default_tasks.push("html")
if (SCHEME.css.enable) default_tasks.push("css")
if (SCHEME.js.enable) default_tasks.push("js")
if (SCHEME.img.enable) default_tasks.push("img")
if (SCHEME.data.enable) default_tasks.push("data")

gulp.task('default',gulp.parallel(...default_tasks))

//clean task
//----------------------------------
const del = require("del");

gulp.task('clean',function(done) {
    //清空打包目录
    let del_files = SCHEME.path + "/**";
    del.sync([del_files]);
    done();
})

//build task
//----------------------------------
gulp.task('build',gulp.series('clean',gulp.parallel(...default_tasks)))

//server task
//----------------------------------
const browserSync = require("browser-sync").create();

gulp.task('server',function(done) {
    //添加本地服务
    let server_config = {
        notify: false,
        open: CONF.server.open,
        server: {
            baseDir: CONF.build.development.path,
            directory: true
        },
        port: CONF.server.port
    };
    browserSync.init(server_config);
    done();
})

gulp.task('reload',function(done) {
    browserSync.reload();
    done();
})

gulp.task('update',function(done) {

    //忽略不被监听的文件
    let ignore_files = [];
    SCHEME.ignore.forEach(function (name, i) {
        ignore_files.push("!" + path.join(sourceRoot, name));
    });

    let watch_files = path.join(sourceRoot, "**/*");
    watch([watch_files, ...ignore_files], function () {
        gulp.parallel(...default_tasks)()
        if(CONF.server.reload) gulp.series('reload')()
    });

    done();
})

//start task
//----------------------------------
gulp.task('start',gulp.series(gulp.parallel(...default_tasks),'server','update'))

