var jake = require('jake')
  , path = require('path')
  , Loader = require(path.join(require.resolve('jake'), '../loader')).Loader;

/**
 * Loads Jakefile and jakelib files of the current generator.
 * @param dirname {String} - directory of the generator
 */
function loadFiles(dirname)
{
  var loader = new Loader();
  loader.loadFile(path.join(dirname, 'Jakefile'));
  loader.loadDirectory(path.join(dirname, 'jakelib'));
}
module.exports.loadFiles = loadFiles;

/**
 * Runs jake with given args
 * @param dirname {String} - Directory in which jakefile and jakelib resides
 * @param ns {String} - namespace of your tasks
 * @param validTasks {Array} - List of task names that are supported on the CLI
 * @param args {Array} - Arguments passed to the generator from the geddy gen command
 */
function run(dirname, ns, validTasks, args)
{
  // keep support of old style gen syntax
  if (args.length > 0 && validTasks.indexOf(args[0]) === -1) {
    args = ['default[' + args.join(',') + ']'];
  }
  else if (args.length == 0) {
    args.push('help');
  }

  if (args.length) {
    // add namespace prefix to task
    args[0] = ns + ':' + args[0];
  }

  // force to load local Jakefile and jakelib
  args.push('--jakefile');
  args.push(path.join(dirname,'Jakefile'));
  args.push('--jakelibdir');
  args.push(path.join(dirname,'jakelib'));

  // run our tasks
  jake.run.apply(jake, args);
}
module.exports.run = run;