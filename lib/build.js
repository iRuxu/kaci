const shell = require('shelljs');

module.exports = {

    gulp: function(tool) {
        let buildcmd = 'gulp build --' + tool
        shell.exec(buildcmd)
    }
    
}