module.exports = {
    //当前构建工具
    tool: "gulp",

    //是否启用webpack打包js模块
    webpack: true,

    //源文件路径
    source: {
        root: "src",
        html: "html",
        hbsmod:"html/module", //hbs子模块目录
        css: "css",
        js: "js",
        jslib:"js/lib",  //开启webpack打包时，不作为模块处理的公共lib库
        img: "img",
        data: "data"
    },

    //本地服务配置
    server: {
        reload: true, //是否自动刷新
        open:false, //是否自动打开
    },

    //构建选项
    build: {
        //本地server方案（localhost预览）
        development: {
            ignore: ["temp/*"], //忽略被监听（相对srcPath.root）
            //输出路径
            path: {
                root: "dist",
                html: "html",
                css: "css",
                js: "js",
                jslib:"js/lib",
                img: "img",
                data: "data"
            },
            //用于hbs模板渲染的全局变量、可根据不同build方案定义不同的cdn地址等
            global: {
                __: "./",
                __css: "../css/",
                __js: "../js/",
                __img: "../img/",
                __data: "../data/"
            },
            //js配置
            js: {
                /*启用webpack时，以下设置不生效，仅webpack.config.js中设置有效
                当启用自定义方案构建时，其webpack常规配置项会继承production方案（除路径等）*/
                ignore: ["module/*", "include/*"], //忽略被编译（子模块）
                compress: false, //是否压缩
                sourcemap: false //是否生成sourcemap
            },
            //css配置
            css: {
                ignore: ["module/*", "include/*"], //忽略被编译（子模块）
                less: {}, //http://lesscss.org/usage/#less-options
                sass: {}, //https://www.npmjs.com/package/node-sass
                autoprefixer: {
                    //前缀处理
                    browsers: ["last 4 versions"] //https://github.com/browserslist/browserslist#queries
                },
                compress: false, //是否压缩
                clean: {
                    //兼容性
                    compatibility: "ie8" //https://github.com/jakubpawlowicz/clean-css#constructor-options
                },
                sourcemap: false //是否生成sourcemap
            },
            //html配置
            html: {
                ignore: ["module/*", "include/*"], //忽略处理（局部模块不需要被编译）
                compress: false, //是否压缩
            },
            img: {
                ignore: ["**/*.psd"] //忽略源文件等
            },
            data: {
                ignore: []
            }
        },
        //默认build方案
        production: {
            //输出路径
            path: {
                root: "build",
                html: "./",
                css: "static/css",
                js: "static/js",
                jslib:"static/js/lib",
                img: "static/img",
                data: "data"
            },
            //可能的线上路径（仅对hbs文件有效）
            global: {
                __: "./",
                __css: "./static/css/",
                __js: "./static/js/",
                __img: "./static/img/",
                __data: "./data/",
            },
            //js压缩
            js: {
                compress: true, //是否压缩
                sourcemap: true //是否生成sourcemap
            },
            //css压缩
            css: {
                compress: true, //是否压缩
            },
            //html压缩
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
            img: {
                ignore: ["**/*.psd","temp/*"] //忽略psd源文件、本地测试图片等
            },
            data: {
                ignore: ["temp/*"] //忽略本地测试数据等
            }
        },
        //自定义模式
        preview:{
            //使用kaci build -s $scheme(此处定义的名称) 即可使用对应模式构建项目
        }
    }
};
