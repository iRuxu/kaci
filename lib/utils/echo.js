const chalk = require('chalk');
const symbols = require('../include/symbols.js');

module.exports = function (style,...str){
    if(arguments.length==1){
        console.log(chalk.cyanBright(`${symbols.flower}\0`,style))
        return 
    }
    let _ = {
        hi : ['cyan',symbols.flower],
        error : ['red',symbols.fail],
        ok : ['green',symbols.success],
        tip : ['yellow',symbols.flower]
    }
    console.log(chalk[`${_[style][0]}Bright`](`${_[style][1]}\0`,...str))
}