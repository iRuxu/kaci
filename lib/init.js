const path = require("path");
const shell = require('shelljs');
const echo = require("./utils/echo");

const _fs = require("./utils/fs.js");

let commonFileSrc = (filename) => path.join(__dirname, "../sample/common/",filename)
let gulpFileSrc = (filename) => path.join(__dirname, "../sample/gulp/",filename)
let rollupFileSrc = (filename) => path.join(__dirname, "../sample/rollup/",filename)
let rootFileDist = (filename) => path.join(process.cwd(),filename)

module.exports = {

    gulp: function() {
        //批量创建目录
        _fs.mkdirs([
            "src",
            "src/css",
            "src/css/module",
            "src/css/include",
            "src/js",
            "src/js/module",
            "src/js/widget",
            "src/js/plugin",
            "src/js/lib",
            "src/html",
            "src/html/module",
            "src/data",
            "src/data/temp",
            "src/img",
            "src/img/temp",
            "src/temp"
        ]);
        //批量创建文件
        let filesMap = [
            [commonFileSrc('gitignore'),rootFileDist(".gitignore")],
            [gulpFileSrc('.babelrc'),rootFileDist(".babelrc")],
            [gulpFileSrc('demo.hbs'),rootFileDist("src/html/index.hbs")],
            [gulpFileSrc('demo.js'),rootFileDist("src/js/index.js")],
            [gulpFileSrc('gulpfile.js'),rootFileDist("gulpfile.js")],
            [gulpFileSrc('kaci.config.js'),rootFileDist("kaci.config.js")],
            [gulpFileSrc('package.json'),rootFileDist("package.json")],
            [gulpFileSrc('webpack.config.js'),rootFileDist("webpack.config.js")]
        ]
        filesMap.forEach(function (pair){
            _fs.mkfiles(pair)().catch(function (e){
                console.log(e)
            })
        })
        
        //安装gulp与依赖
        echo('tip',`install : 检查与安装依赖包..`)
        !shell.which('gulp') && shell.exec('npm install -g gulp')
        !!shell.which('cnpm') ? shell.exec('cnpm install') : shell.exec('npm install')
        //初始化完成
        echo('ok',`success : 初始化成功`)
    },

    rollup:function (){
        //批量创建目录
        _fs.mkdirs([
            'lib',
            'bin'
        ])
        //批量创建文件
        _fs.mkfiles([
            [commonFileSrc('.gitignore'),rootFileDist(".gitignore")],
            [rollupFileSrc('.npmignore'),rootFileDist(".npmignore")],
            [rollupFileSrc('rollup.config.js'),rootFileDist("rollup.config.js")],
            [rollupFileSrc('.babelrc'),rootFileDist(".babelrc")],
            [rollupFileSrc('package.json'),rootFileDist("package.json")],
            [rollupFileSrc('kaci.config.js'),rootFileDist("kaci.config.js")],
        ])
        //安装rollup与依赖
        echo('tip',`install : 检查与安装依赖包..`)
        !shell.which('rollup') && shell.exec('npm install -g rollup')
        !!shell.which('cnpm') ? shell.exec('cnpm install') : shell.exec('npm install')
        //初始化完成
        echo('ok',`success : 初始化成功`)
    },

    webpack:function (){
        console.log('doing..')
    }

};
