const shell = require('shelljs');

module.exports = {

    gulp: function(port) {
        !shell.which('gulp') && shell.exec('npm install -g gulp')
        shell.exec(`gulp start --${port}`)
    }
    
}