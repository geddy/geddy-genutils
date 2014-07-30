var path = require('path')
  , geddyPath = path.normalize(path.join(require.resolve('geddy'), '../../'));

module.exports.geddyPath = geddyPath;
module.exports.template = require('./lib/template');

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