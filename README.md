# KACI
整合 Gulp & webpack 的前端构建方案，懒人 "0" 配置。

## _功能_
+ typescript
+ babel
+ less
+ sass/sacc
+ handlebars
+ jsonlint


## _安装_
使用 npm 安装，也可以使用 cnpm 或 yarn 安装。

```
npm install -g kaci
```

## _使用_
#### **1.初始化项目**

```
kaci init           //默认工具：gulp
kaci init -t gulp
```

初始化项目（默认gulp）  
可通过-t指定其他工具构建，自动生成初始项目结构，并自动安装相关依赖。  
支持的工具列表：gulp

#### **2.启动本地服务**

```
kaci start          //默认端口：512
kaci start -p 8080
```

启动本地服务（默认端口为 512）  
本地服务的构建使用 _kaci.config.js_ 中 **build.default** 的配置。

#### **3.打包发布项目**

```
kaci build          //默认方案：production
kaci build -s 方案名
```

打包项目（默认方案production）  
默认方案使用 _kaci.config.js_ 中 **build.production** 的配置。  
你可以在 **build** 对象下新建一个键，作为自定义方案名（例如"preview"），并拷贝修改需要的内容（未定义的配置会继承default方案配置），通过-s指定方案名按照新方案重新打包发布。

#### **4.获取更多帮助**

```
kaci help
```

## 配置文件 kaci.config.js
**注意：当修改配置文件后，需要重新启动命令才能生效。**

```javascript
module.exports = {
    //当前构建工具
    tool: "gulp",

    //源文件路径
    source: {
        root: "src",
        html: "src/template",
        css: "src/css",
        js: "src/js",
        img: "src/img",
        data: "src/data"
    },

    //本地服务配置
    server: {
        reload: true, //是否自动刷新
        open:false, //是否自动打开
    },

    //构建选项
    build: {
        //本地server方案（localhost预览）
        default: {
            ignore: ["temp/*"], //忽略被监听（相对srcPath.root）
            //输出路径
            path: {
                root: "dist",
                html: "dist/template",
                css: "dist/css",
                js: "dist/js",
                img: "dist/img",
                data: "dist/data"
            },
            //用于hbs模板渲染的全局变量、可根据不同build方案定义不同的地址
            url: {
                __: "./",
                __css: "../css/",
                __js: "../js/",
                __img: "../img/",
                __data: "../data/"
            },
            //js配置
            js: {
                ignore: ["module/*", "include/*"], //忽略被编译（子模块）
                babel: {
                    //https://babeljs.io/docs/usage/api/#options
                    presets: ["env", "react"],
                    plugins: []
                },
                typescript: {
                    //https://www.tslang.cn/docs/handbook/compiler-options.html
                    lib: ["DOM", "ES2015"], //编译lib
                    target: "ES3", //编译目标ES版本 ES5,ES6,ES2015,ES2016,ES2017,ESNext
                    alwaysStrict: true
                },
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
                    browsers: ["defaults"] //https://github.com/browserslist/browserslist#queries
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
                ignore: ["module/*", "include/*"], //忽略处理（局部模块不需要被编译、临时页面）
                handlebars: {
                    batch: ["./src/template/module"] //hbs子模块目录
                },
                compress: false, //是否压缩
                minifier: {} //https://github.com/kangax/html-minifier#options-quick-reference
            },
            img: {
                ignore: ["psd/*"] //忽略被处理（psd源文件等）
            },
            data: {
                ignore: ["_bak/*"] //忽略被处理（备用数据）
            }
        },
        //默认build方案
        production: {
            //输出路径
            path: {
                root: "build",
                html: "build",
                css: "build/static/css",
                js: "build/static/js",
                img: "build/static/img",
                data: "build/data"
            },
            //可能的线上路径（仅对hbs文件有效），可指定为绝对路径
            url: {
                __: "./",
                __css: "./static/css/",
                __js: "./static/js/",
                __img: "./static/img/",
                __data: "./data/",
                __title: "Demo"
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
                }
            },
            img: {
                ignore: ["psd/*","temp/*"] //忽略被处理（psd源文件、本地测试图片等）
            },
            data: {
                ignore: ["_bak/*","temp/*"] //忽略被处理（本地测试数据等）
            }
        },
        //自定义方案
        preview: {
            //使用kaci build -s $scheme(此处定义的名称) 即可使用对应模式构建项目
        }
    }
};
```
