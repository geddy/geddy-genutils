var fs = require('fs');
var path = require('path')
  , geddyPath = path.normalize(path.join(require.resolve('geddy'), '../../'));

var engineToExt = {
  'ejs': '.ejs',
  'handlebars': '.hbs',
  'mustache': '.ms',
  'jade': '.jade',
  'swig': '.swig',
  'none': ''
};

var extToEngine = {};

for(var engine in engineToExt) {
  extToEngine[engineToExt[engine]] = engine;
}

var defaultEngine = 'ejs'
  , defaultExt = '.ejs';

// Load the basic Geddy toolkit
require(path.join(geddyPath,'lib/geddy'));

// Dependencies
var cwd = process.cwd()
  , utils = require(path.join(geddyPath, 'lib/utils'))
  , Adapter = require(path.join(geddyPath, 'lib/template/adapters')).Adapter;

/**
 * Writes a template file
 *
 * @param src {String}
 * @param dest {String}
 * @param data {Object}
 * @oaram transform {Function(content, data)} - (optional) if set this function can transform the rendered template before it gets written to the file
 */
function write(src, dest, data, transform) {
  var ext = path.extname(src)
    , supported = ['.ejs', '.jade', '.ms', '.swig', '.hbs'];

  if (!extToEngine[ext]) {
    fail('Unsuported template engine. Try one of these instead: ' + supported.join(', '));
    return;
  }

  var text = fs.readFileSync(src, 'utf8').toString()
    , adapter
    , templContent;

  // render with the correct adapter
  adapter = new Adapter({engine: getEngineFromExt(ext), template: text});
  templContent = adapter.render(data);

  if (typeof transform === 'function') {
    templContent = transform(templContent, data);
  }

  // Write file
  fs.writeFileSync(dest, templContent, 'utf8');

  console.log('[Added] ' + dest);
}
module.exports.write = write;

function getEngineFromExt(ext)
{
  return extToEngine[ext] || defaultEngine;
}
module.exports.getEngineFromExt = getEngineFromExt;

function getExtFromEngine(engine)
{
  return engineToExt[engine] || defaultExt;
}
module.exports.getExtFromEngine = getExtFromEngine;