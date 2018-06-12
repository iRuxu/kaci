const path = require("path");
const fs = require('fs');
const shell = require('shelljs');
const echo = require("./utils/echo");

const _fs = require("./utils/fs.js");
let gulpFileSrc = (filename) => path.join(__dirname, "../sample/gulp/",filename)
let gulpFileDist = (filename) => path.join(process.cwd(),filename)

module.exports = {

    gulp: function() {
        //批量创建目录
        _fs.mkdirs([
            "src",
            "src/css",
            "src/css/module",
            "src/js",
            "src/js/module",
            "src/template",
            "src/template/module",
            "src/data",
            "src/data/temp",
            "src/data/_bak",
            "src/img",
            "src/img/temp",
            "src/img/psd",
            "src/temp",
            "dist",
        ]);
        //批量创建文件
        _fs.mkfiles([
            [gulpFileSrc('.gitignore'),gulpFileDist(".gitignore")],
            [gulpFileSrc('gulpfile.js'),gulpFileDist("gulpfile.js")],
            [gulpFileSrc('kaci.config.js'),gulpFileDist("kaci.config.js")],
            [gulpFileSrc('package.json'),gulpFileDist("package.json")],
            [gulpFileSrc('demo.hbs'),gulpFileDist("src/template/index.hbs")]
        ])
        //安装gulp与依赖
        echo('tip',`install : 检查与安装依赖包..`)
        !shell.which('gulp') && shell.exec('npm install -g gulp')
        !!shell.which('cnpm') ? shell.exec('cnpm install') : shell.exec('npm install')
        //初始化完成
        echo('ok',`success : 初始化成功`)
    }

};
