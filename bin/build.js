const shell = require('shelljs');
const version = require('../package.json').version

shell.exec(`git tag ${version}`)
shell.exec(`git push origin ${version}`)
shell.exec('npm publish')