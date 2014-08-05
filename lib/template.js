var fs = require('fs');
var path = require('path')
  , geddyPath = path.normalize(path.join(require.resolve('geddy'), '../../'));

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
 */
function write(src, dest, data) {
  var ext = path.extname(src)
    , supported = ['.ejs', '.jade', '.ms', '.swig', '.hbs']
    , map = { '.ejs': 'ejs', '.jade': 'jade', '.ms': 'mustache', '.hbs': 'handlebars'};

  if (!map[ext]) {
    fail('Unsuported template engine. Try one of these instead: ' + supported.join(', '));
    return;
  }

  var text = fs.readFileSync(src, 'utf8').toString()
    , adapter
    , templContent;

  // render with the correct adapter
  adapter = new Adapter({engine: map[ext], template: text});
  templContent = adapter.render(data);

  // Write file
  fs.writeFileSync(dest, templContent, 'utf8');

  console.log('[Added] ' + dest);
}
module.exports.write = write;