const shell = require('shelljs');

module.exports = {

    gulp: function(scheme) {
        !shell.which('gulp') && shell.exec('npm install -g gulp')
        shell.exec(`gulp build --${scheme}`)
    }

}