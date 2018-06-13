const shell = require('shelljs');

module.exports = {

    gulp: function(scheme) {
        shell.exec(`gulp build --${scheme}`)
    },

    rollup:function (){
        shell.exec('rollup --config rollup.config.js')
    },

    webpack:function (){
        console.log('doing..')
    }
    
}