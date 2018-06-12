const shell = require('shelljs');
const echo = require("./utils/echo");

module.exports = {

    gulp: function(port) {
        let startcmd = 'gulp start --' + port
        shell.exec(startcmd)
    },

    rollup:function (){
        echo('error','此工作模式无start命令')
    }
    
}