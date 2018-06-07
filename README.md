# KACI

基于 Gulp & webpack 的前端构建方案，懒人 "0" 配置。

## *Install*

使用 npm 安装，也可以使用 cnpm 或 yarn 安装。

```
npm install -g kaci
```

## *Usage*

#### **1.初始化项目**

```
kaci init           //默认方式：gulp
```

默认以**gulp**构建一个前端项目，自动生成初始结构，并会自动安装相关依赖包至项目。  
你也指定为其它构建框架，例如 webpack 等。（_暂时只添加了 gulp_）

#### **2.启动本地服务**

```
kaci start          //默认端口：512
kaci start -p 8080
```

启动一个本地服务，默认端口为 512，也可以指定一个其它端口。  
默认开启浏览器自动刷新，可以修改生成的 kaci.config.js 中*server.reload*项来禁用。  
其中本地服务的构建使用 kaci.config.js 中*build.default*的配置。

#### **3.打包发布项目**

```
kaci build          //默认方案：production
kaci build -m preview
```

打包发布项目，默认使用 kaci.config.js 中的*build.production*方案。  
你可以在 build 下创建其它方案名，例如"preview"用于测试服务器，你只需要执行命令"kaci build -m preview"，则会以其配置重新 build 至新的目录。（你可以指定任意名称，除"default"与"production"）

#### **4.获取更多帮助**

```
kaci help
```

## 配置 kaci.config.js

默认已经为你生成一份 demo，你可以根据自己的需要修改它。  
**注意：当修改配置文件后，需要重新启动命令才能生效。**

```javascript
module.exports = {

    //当前构建模式
    mode: "gulp",

    //源文件路径，你可以根据需要重新定义它们（相对项目根目录）
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
        reload: true    //true自动刷新,false关闭自动刷新
    },

    //构建选项
    build: {

        //本地服务方案
        default: {
            ...
            //用于提供localhost
        },

        //默认Build方案
        production: {

            //build输出路径
            path: {
                root: "build",
                html: "build",
                css: "build/static/css",
                js: "build/static/js",
                img: "build/static/img",
                data: "build/data"
            },
            //用于hbs模板渲染的全局变量、可根据不同build方案定义不同的地址
            url: {
                __: "http://www.iruxu.com/",
                __css: "http://cdn.iruxu.com/css/",
                __js: "http://cdn.iruxu.com/js/",
                __img: "http://cdn.iruxu.com/img/",
                __data: "http://data.iruxu.com/",
                __title:"Demo"
            },
            //js配置
            js: {
                ignore: ["module/*", "include/*"], //忽略不被编译的子模块
                babel: {...},  //babel编译选项
                typescript: {...}, //typescript编译选项
                compress: true, //是否压缩
                sourcemap: true //是否生成sourcemap
            },
            //css配置
            css: {
                ignore: ["module/*", "include/*"], //忽略不被编译的子模块
                less: {...}, //less编译选项
                sass: {...}, //sass编译选项
                autoprefixer: {...}, //autoprefixer编译选项
                compress: true, //是否压缩
                sourcemap: false //是否生成sourcemap
            },
            //html配置
            html: {
                ignore: ["module/*", "include/*"], //忽略处理（局部模块不需要被编译、临时页面）
                handlebars: {
                    batch: ["./src/template/module"] //hbs子模块目录
                },
                compress: true, //是否压缩
                minifier: {...} //html压缩选项
            },
            //图片配置
            img: {
                ignore: ["temp/*"] //忽略被处理（临时文件）
            },
            //数据配置
            data: {
                ignore: ["temp/*"] //忽略被处理（本地测试数据）
            }
        },

        //测试服务器build方案
        preview : {
            ...
            //可以使用kaci build -mode preview按照此配置来build
            //你可以使用任意名称，除default与production
        }
    }
};
```
