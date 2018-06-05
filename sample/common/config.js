module.exports = {
    //当前构建模式
    mode:"gulp",    //TODO:动态写入

    //源文件路径
    srcPath:{
        root:'src',
        css:'src/css',
        js:'src/js',
        img:'src/img',
        html:'src/template',
        data:'src/data'
    },

    //本地服务路径
    distPath:{
        root:'dist',
        css:'dist/css',
        js:'dist/js',
        img:'dist/img',
        html:'dist/template',
        data:'dist/data'
    },
    
    //构建选项
    build:{
        //默认方案
        default:{
            ignore:['temp/*'],  //忽略被监听与build、相对srcPath.root
            js:{
                typescript:{    //https://www.tslang.cn/docs/handbook/compiler-options.html
                    "lib":["DOM","ES2015"], //编译lib
                    "target":"ES3",         //编译目标ES版本 ES5,ES6,ES2015,ES2016,ES2017,ESNext
                    "listFiles":true,
                    "allowJs":true,
                    "alwaysStrict":true
                },
                compress:false,     //是否压缩
                sourcemap:false     //是否生成sourcemap
            },
            css:{
                less:{}, //http://lesscss.org/usage/#less-options
                sass:{}, //https://www.npmjs.com/package/node-sass
                ignore:['module/*','include/*'],      //忽略被编译
                autoprefixer:{      //前缀处理
                    browsers: ["defaults"] //https://github.com/browserslist/browserslist#queries
                },
                compress:false,     //是否压缩
                clean:{             //兼容性
                    compatibility:'ie8' //https://github.com/jakubpawlowicz/clean-css#constructor-options
                },
                sourcemap:false      //是否生成sourcemap
            },
            html:{
                compress:false,        //是否压缩
                minifier:{
                    removeComments:true,       //移除注释
                    collapseWhitespace:true    //移除无效空格
                },  //https://github.com/kangax/html-minifier#options-quick-reference
            },
            global:{
                __:'./',
                __css:'./css/',
                __js:'./js/',
                __html:'./template/',
                __img:'./img/',
                __data:'./data/'
            }
        },
    }

}