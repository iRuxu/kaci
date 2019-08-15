const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const CONF = require("./kaci.config.js");
const lodash = require("lodash");

//获取多页面的每个入口文件，用于配置中的entry
function getEntry() {
    let filelist = fs.readdirSync(path.resolve(process.cwd(), CONF.source.root,CONF.source.js));
    let matchs = [],
        files = {};
    filelist.forEach(function(file) {
        matchs = file.match(/(.+)\.js$/);
        if (matchs) {
            files[matchs[1]] = path.resolve(
                process.cwd(),
                CONF.source.root,
                CONF.source.js,
                file
            );
        }
    });
    return files;
}

//公共方案设置
const common_config = {
    entry: getEntry(),
    output: {
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    externals: {
        jquery:'jQuery'
    }
};

//development方案配置
let dev_config = lodash.merge({}, common_config, {
    mode: "development",
    output: {
        path: path.resolve(__dirname,CONF.build.development.path.root, CONF.build.development.path.js)
    },
    devtool: "eval"
});

//production方案配置
let pro_config = lodash.merge({}, common_config, {
    mode: "production",
    output: {
        path: path.resolve(__dirname,CONF.build.production.path.root, CONF.build.production.path.js)
    },
    devtool: "source-maps",
    plugins: []
});

module.exports = [dev_config, pro_config];
