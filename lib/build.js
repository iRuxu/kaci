const shell = require('shelljs');

module.exports = {

    gulp: function(scheme) {
        let buildcmd = 'gulp build --' + scheme
        shell.exec(buildcmd)
    }
    
}