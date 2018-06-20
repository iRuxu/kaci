const shell = require('shelljs');
const echo = require("./utils/echo");

module.exports = {

    gulp: function(port) {
        !shell.which('gulp') && shell.exec('npm install -g gulp')
        shell.exec(`gulp start --${port}`)
    },

    rollup:function (){
        echo('error','此工作模式无start命令')
    },

    webpack:function (){
        console.log('doing...')
    }
    
}