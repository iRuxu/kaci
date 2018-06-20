const shell = require('shelljs');

module.exports = {

    gulp: function(scheme) {
        !shell.which('gulp') && shell.exec('npm install -g gulp')
        shell.exec(`gulp build --${scheme}`)
    },

    rollup:function (){
        !shell.which('rollup') && shell.exec('npm install -g rollup')
        shell.exec('rollup --config rollup.config.js')
    },

    webpack:function (){
        console.log('doing..')
    }
    
}