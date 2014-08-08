var exec = require('child_process').exec;

/**
 * Installs bower components
 * @param deps {Array}
 * @param cb {Function(error)} - Called when all components installed
 */
function install(deps, cb)
{
  var p = exec('bower install ' + deps.join(' ') + ' --save', cb);
  p.stdout.pipe(process.stdout);
  p.stderr.pipe(process.stderr);
}
module.exports.install = install;

/**
 * Uninstalls bower components
 * @param deps {Array}
 * @param cb {Function(error)} - Called when all components uninstalled
 */
function uninstall(deps, cb)
{
  var p = exec('bower uninstall ' + deps.join(' ') + ' --save', cb);
  p.stdout.pipe(process.stdout);
  p.stderr.pipe(process.stderr);
}
module.exports.uninstall = uninstall;