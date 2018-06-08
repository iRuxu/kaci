const shell = require('shelljs');

module.exports = {

    gulp: function(port) {
        let startcmd = 'gulp start --' + port
        shell.exec(startcmd)
    }
    
}