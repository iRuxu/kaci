# KACI
整合 Gulp & webpack 的前端构建方案，懒人 "0" 配置。

## _功能_
---
+ typescript
+ babel
+ less
+ sass/sacc
+ handlebars
+ jsonlint


## _安装_

---

使用 npm 安装，也可以使用 cnpm 或 yarn 安装。

```
npm install -g kaci
```

## _使用_

---

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
你可以在 **build** 对象下新建一个键，作为自定义方案名（例如"preview"），并拷贝修改需要的内容，通过-s指定方案名按照新方案重新打包发布。

#### **4.获取更多帮助**

```
kaci help
```

## 配置文件 kaci.config.js

---

**注意：当修改配置文件后，需要重新启动命令才能生效。**

```javascript
module.exports = {

    //当前构建模式
    tool: "gulp",

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
        reload: true,    //true自动刷新,false关闭自动刷新
        open: false,     //是否自动打开
    },

    //构建选项
    build: {

        //本地服务方案、用于提供localhost
        default: {
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

        //默认build方案
        production: {
            ...
            //修改对应的输出路径，并设置需要修改的项            
        },

        //自定义build方案
        preview : {
            ...
            //可以使用 [kaci build -m 方案名] 按照此配置来build
            //你可以使用任意名称，但除default与production
        }
    }
};
```
