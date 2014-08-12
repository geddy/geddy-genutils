var fs = require('fs');
var path = require('path')
  , utils = require('utilities')
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
    throw new Error('Unsuported template engine. Try one of these instead: ' + supported.join(', '));
    return;
  }

  // Write file
  fs.writeFileSync(dest, render(src, getEngineFromExt(ext), data, transform), 'utf8');

  console.log('[Added] ' + dest);
}
module.exports.write = write;

/**
 * Renders a template file
 *
 * @param src {String}
 * @param engine {String} - Template engine
 * @param data {Object}
 * @param transform {Function(content, data)} - (optional) if set this function can transform the rendered template before it gets written to the file
 * @returns {String}
 */
function render(src, engine, data, transform)
{
  var supported = Object.keys(engineToExt);

  if (!engineToExt[engine]) {
    throw new Error('Unsuported template engine. Try one of these instead: ' + supported.join(' '));
    return;
  }

  var text = fs.readFileSync(src, 'utf8').toString()
    , adapter
    , templContent;

  // render with the correct adapter
  adapter = new Adapter({engine: engine, template: text});
  templContent = adapter.render(data);

  if (typeof transform === 'function') {
    templContent = transform(templContent, data);
  }

  return templContent;
}
module.exports.render = render;

/**
 * Returns template engine for a file extension
 * @param ext {String}
 * @returns {String}
 */
function getEngineFromExt(ext)
{
  return extToEngine[ext] || defaultEngine;
}
module.exports.getEngineFromExt = getEngineFromExt;

/**
 * Returns file extension for a template engine
 * @param engine {String}
 * @returns {String}
 */
function getExtFromEngine(engine)
{
  return engineToExt[engine] || defaultExt;
}
module.exports.getExtFromEngine = getExtFromEngine;

/**
 * Returns an engine specific script include
 * @param src {String}
 * @param engine {String}
 * @returns {string}
 */
function script(src, engine) {
  switch(engine) {
    case 'ejs':
      return "<@- scriptLink('" + src + "', {type:'text/javascript', noPrefix: true}) @>";
      break;
    case 'jade':
      return "!= scriptLink('" + src + "', {type:'text/javascript', noPrefix: true})";
      break;
    case 'swig':
      return "{{ scriptLink('" + src + "', {type:'text/javascript', noPrefix: true}) }}";
      break;
    case 'handlebars':
    case 'mustache':
    default:
      return '<script type="text/javascript" src="' + src + '"></script>';
  }
}
module.exports.script = script;

/**
 * Returns an engine specific stylesheet include
 * @param src {String}
 * @param engine {String}
 * @returns {string}
 */
function stylesheet(src, engine) {
  switch(engine) {
    case 'ejs':
      return "<@- styleLink('" + src + "', {rel:'stylesheet', noPrefix: true}) @>";
      break;
    case 'jade':
      return "!= styleLink('" + src + "', {rel:'stylesheet', noPrefix: true})";
      break;
    case 'swig':
      return "{{ styleLink('" + src + "', {rel:'stylesheet', noPrefix: true}) }}";
      break;
    case 'handlebars':
    case 'mustache':
    default:
      return '<link rel="stylesheet" href="' + src + '">';
  }
}
module.exports.stylesheet = stylesheet;

/**
 * Returns an engine specific partial include
 * @param src {String}
 * @param data {String} - (optional)
 * @param engine {String}
 * @returns {string}
 */
function partial(/*src, [data], engine*/) {
  var args = Array.prototype.slice.call(arguments);
  var src = args.shift();
  var engine = args.pop();
  var data = args.pop() || null;
  if (data) {
    data = ', ' + data;
  }
  else data = '';

  switch(engine) {
    case 'ejs':
      return "<@- partial('" + src + "'" + data + ") @>";
      break;
    case 'jade':
      return "!= partial('" + src + "'" + data + ")";
      break;
    case 'swig':
      return "{{ partial('" + src + "'" + data + ") }}";
      break;
    case 'handlebars':
    case 'mustache':
      return "{{{partial('" + src + "'" + data + ")}}}";
      break;
    default:
      return "<!-- partial('" + src + "'" + data + ") -->";
  }
}
module.exports.partial = partial;

/**
 * Returns engine specific unescaped content
 * @param content {String}
 * @param engine {String}
 * @returns {String}
 */
function unescaped(content, engine)
{
  switch(engine) {
    case 'ejs':
      return "<@- " + content + " @>";
      break;
    case 'jade':
      return "!= " + content;
      break;
    case 'swig':
      return "{{ " + content + " }}";
      break;
    case 'handlebars':
    case 'mustache':
      return "{{{" + content + "}}}";
      break;
    default:
      return '<!-- ' + content + ' -->';
  }
}
module.exports.unescaped = unescaped;

/**
 * Returns engine specific escaped content
 * @param content {String}
 * @param engine {String}
 * @returns {String}
 */
function escaped(content, engine)
{
  switch(engine) {
    case 'ejs':
      return "<@= " + content + " @>";
      break;
    case 'jade':
      return "!= " + content;
      break;
    case 'swig':
      return "{{ " + content + " }}";
      break;
    case 'handlebars':
    case 'mustache':
      return "{{{" + content + "}}}";
      break;
    default:
      return '<!-- ' + content + ' -->';
  }
}
module.exports.escaped = escaped;

/**
 * Escapes a string
 * @param str {String}
 * @return {String}
 */
function escape(str)
{
  return utils.string.escapeXML(str.replace(/;\S*/, ''));
}
module.exports.escape = escape;