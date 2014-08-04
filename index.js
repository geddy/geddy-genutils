var path = require('path')
  , fork = require('child_process').fork
  , geddyPath = path.normalize(path.join(require.resolve('geddy'), '../../'));

module.exports.geddyPath = geddyPath;
module.exports.template = require('./lib/template');
module.exports.jake = require('./lib/jake');

/**
 * Checks if a command line flag is set
 *
 * @param shortName {String}
 * @param name {String}
 * @returns {boolean}
 */
function flagSet(shortName, name) {
  return process.argv.indexOf(shortName) !== -1 || process.argv.indexOf(name) !== -1;
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
 * @param task {String} - generator task to execute, set to fals/null for the default
 * @param args {Array} - generator arguments
 * @param shared {Object} - (optional) Data to share between the generators
 * @param cb {Function} - (optional) callback(error)
 */
function runGen(/*generator, task, args, [shared, cb]*/)
{
  var args = Array.prototype.slice.call(arguments);
  var generator = args.shift();
  var task = args.shift();
  var _args = args.shift();
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

  if (task) {
    _args = [task].concat(_args);
  }

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