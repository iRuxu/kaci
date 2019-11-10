# KACI
整合 Gulp & webpack 的前端构建方案。  
一个配置文件即可完成所有参数定义、极易扩展。

## _更新_
+ 目前适配到nodejs v12 + gulp4，如果你的npm版本较低，请先升级npm```npm install -g npm```
+ 如果你先前将 gulp 旧版(v4以前)安装到全局环境中了，请执行 ```npm rm -g gulp```

## _功能_
+ Javascript : webpack、babel
+ CSS : less、sass、autoprefix
+ HTML : handlebars
+ JSON : jsonlint

## _安装_
使用 npm 安装，也可以使用 cnpm 或 yarn 安装。
```
npm install -g kaci
npm install -g gulp-cli
```

## _使用_
#### **1.初始化项目**
```
kaci gulp          
```  

#### **2.启动本地服务**
```
gulp start          //默认端口：1024
```

启动本地服务（默认端口为 1024）  
本地服务的构建使用 _kaci.config.js_ 中 **build.development** 的配置。  
如运行一个已有项目，你可能需要手动安装项目依赖：```npm install```

#### **3.打包发布项目**
```
gulp build
```
打包项目（默认方案production）  
默认方案使用 _kaci.config.js_ 中 **build.production** 的配置。  
你可以在 **build** 对象下新建一个键，作为自定义方案名（例如"preview"），并拷贝修改需要的内容（未定义的配置会继承development方案配置），在gulpfile.js中添加一个新的任务，并在config settings区块中添加模式映射键值。

## 配置文件 kaci.config.js
**注意：当修改配置文件后，需要重新启动命令才能生效。**

```javascript
module.exports = {

    //本地服务配置
    server: {
        port : 1024,    //端口
        reload: false,  //是否自动刷新
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
            path: "./localserver",
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
```
