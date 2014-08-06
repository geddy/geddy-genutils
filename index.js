var path = require('path')
  , fs = require('fs')
  , fork = require('child_process').fork
  , geddyPath = path.normalize(path.join(require.resolve('geddy'), '../../'));

module.exports.geddyPath = geddyPath;
module.exports.template = require('./lib/template');
module.exports.jake = require('./lib/jake');

/**
 * Checks if a command line flag is set
 *
 * @param shortName {String} - (optional)
 * @param name {String} - (optional)
 * @returns {boolean}
 */
function flagSet(shortName, name) {
  if (shortName && name) {
    return process.argv.indexOf(shortName) !== -1 || process.argv.indexOf(name) !== -1;
  }
  else if (name && !shortName) {
    return process.argv.indexOf(name) !== -1;
  }
  else if (shortName && !name) {
    return process.argv.indexOf(shortName) !== -1;
  }

  return false;
}

module.exports.flagSet = flagSet;

/**
 * Loads the basic geddy environment.
 *
 * @returns {*}
 */
function loadGeddy()
{
  return require(path.join(geddyPath, 'lib/geddy'));
}
module.exports.loadGeddy = loadGeddy;

/**
 * Loads the geddy toolkit.
 *
 * @returns {*}
 */
function loadGeddyUtils()
{
  return require(path.join(geddyPath, 'lib/utils'));
}
module.exports.loadGeddyUtils = loadGeddyUtils;

/**
 * Executes another generator in a child process
 * @param generator {String} - name of the generator e.g. "geddy-gen-model"
 * @param args {Array} - generator arguments
 * @param shared {Object} - (optional) Data to share between the generators
 * @param cb {Function} - (optional) callback(error)
 */
function runGen(/*generator, args, [shared, cb]*/)
{
  var args = Array.prototype.slice.call(arguments);
  var generator = args.shift();
  var _args = args.shift() || [];
  var cb = args.pop();
  var shared = args.pop();

  if (typeof cb !== 'function') {
    cb = function() {};
  }

  // push args to process.argv too
  _args.forEach(function(arg) {
    if (process.argv.indexOf(arg) === -1) {
      process.argv.push(arg);
    }
  });

  var gen = require(generator);
  var appPath = process.cwd();
  process._shared = shared;
  gen(appPath, _args);
  cb(null);
}
module.exports.runGen = runGen;

/**
 * Returns shared data that has been passed from another generator.
 */
function getShared()
{
  return process._shared || {};
}
module.exports.getShared = getShared;

/**
 * Return path to generator directory
 * @param generator {String}
 * @returns {String|null}
 */
function getGenDir(generator)
{
  return path.dirname(require.resolve(generator));
}
module.exports.getGenDir = getGenDir;

/**
 * Checks if we are in the app's root directory
 * @returns {Boolean}
 */
function inAppRoot()
{
  var appPath = process.cwd();
  return fs.existsSync(path.join(appPath, 'app'));
}
module.exports.inAppRoot = inAppRoot;