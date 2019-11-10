module.exports = {

    //本地服务配置
    server: {
        port : 1024,    //端口
        reload: true,  //是否自动刷新
        open: false,    //是否自动打开
    },

    //源文件路径
    source: {
        root: "./src",
        html: "html",
        hbsmod:"html/module", //hbs子模块目录
        css: "css",
        js: "js",
        jslib:"js/lib",  //不经过编译的公共lib库
        img: "img",
        data: "data"
    },

    //构建选项
    build: {
        //本地server方案（localhost预览）
        development: {
            name : 'development',
            ignore: ["temp/*"], //忽略被监听（相对srcPath.root）
            //输出路径
            path: "./localhost",
            //模板变量（用于hbs模板渲染的全局变量、可根据不同build方案定义不同的cdn地址等）
            vars: {
                __: "./",
                __css: "../css/",
                __js: "../js/",
                __img: "../img/",
                __data: "../data/"
            },
            //html配置
            html: {
                enable: true,   //是否启用相关功能
                ignore: ["module/*"], //忽略处理（局部模块不需要被编译）
                compress: false, //是否压缩
            },
            //css配置
            css: {
                enable: true,   //是否启用相关功能
                ignore: ["module/*", "include/*","widget/*","plugin/*"], //忽略被编译（子模块）
                mode: 'less',   //使用less or sass
                less: {}, //http://lesscss.org/usage/#less-options
                sass: {}, //https://www.npmjs.com/package/node-sass
                autoprefixer: {},
                compress: false, //是否压缩
                clean: {
                    //兼容性
                    compatibility: "ie8" //https://github.com/jakubpawlowicz/clean-css#constructor-options
                }
            },
            //js配置
            js: {
                enable: true,   //是否启用相关功能
                //是否启用webpack打包js模块
                webpack: true,
                /*启用webpack时，以下设置不生效，仅webpack.config.js中设置有效
                当启用自定义方案构建时，其webpack常规配置项会继承production方案（除路径等）*/
                ignore: ["lib/*","module/*", "include/*"], //忽略被编译（子模块）
                compress: false, //是否压缩
                sourcemap: false //是否生成sourcemap
            },
            //图片配置
            img: {
                enable: true,   //是否启用相关功能
                ignore: ["**/*.psd"] //忽略源文件等
            },
            //数据配置
            data: {
                enable: true,   //是否启用相关功能
                ignore: []
            }
        },
        //默认build方案
        production: {
            name : 'production',
            //输出路径
            path: "./dist",
            //模板变量（可能的线上路径，仅对hbs文件有效）
            vars: {
                __: "./",
                __css: "./static/css/",
                __js: "./static/js/",
                __img: "./static/img/",
                __data: "./data/",
            },
            //html配置
            html: {
                compress: true, //是否压缩
                minifier: {		
                    removeComments: true, //移除注释		
                    collapseWhitespace: true, //移除无效空格		
                    collapseBooleanAttributes: true,		
                    removeAttributeQuotes: true,		
                    removeRedundantAttributes: true,		
                    removeEmptyAttributes: true,		
                    removeScriptTypeAttributes: true,		
                    removeStyleLinkTypeAttributes: true,		
                    removeOptionalTags: true		
                }//https://github.com/kangax/html-minifier#options-quick-reference
            },
            //css配置
            css: {
                compress: true, //是否压缩
            },
            //js配置
            js: {
                compress: true, //是否压缩
                sourcemap: true //是否生成sourcemap
            },
            //图片配置
            img: {
                ignore: ["**/*.psd","temp/*"] //忽略psd源文件、本地测试图片等
            },
            //数据配置
            data: {
                ignore: ["temp/*"] //忽略本地测试数据等
            }
        }
    }
}
