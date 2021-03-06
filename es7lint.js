const { promisify } = require('util');
const colors = require('colors');
const fs = require('fs');
const path = require('path');
const lebab = require('lebab');
const glob = require('globby');
const basedir = process.cwd();
const fsReadFile = promisify(fs.readFile);
const fsWriteFile = promisify(fs.writeFile);
const fsStat = promisify(fs.stat);
const standard = require('customstandard');
const slash = require('slash');
const pkg = require('./package.json');
function errHandler(e) {
  console.log('[es7lint]:'.cyan, e.red);
  process.exit(0);
}
async function codewriter(codeobj, out) {
  let file = Object.keys(codeobj).shift();
  let code = codeobj[file];
  if (out == 'prefix') {
    let parts = path.parse(file);
    let fname = parts.name + prefix + parts.ext;
    file = path.join(parts.dir, fname);
  }
  console.log('Writting to file...'.green, file);
  return await fsWriteFile(file, code);
}

function prettyFormat(code) {
  return new Promise((resolve, reject) => {
    try {
      standard.lintText(code, {fix: true}, (err, results) => {
        if (err) { reject(err); }

        let out = results.results[0].output;
        if (typeof out === 'undefined') {
          out = code;
        }
        resolve(out);
      });
    } catch (e) {
      reject(e);
    }
  });
}
async function isFileDir(f) {
  try {
    let stats = await fsStat(f);
    return stats.isDirectory() || stats.isFile();
  } catch (e) {
    return false;
  }
}
async function es7lint(file, opts) {
  try {
    let oldcode = '';
    let fname = file;
    if (!await isFileDir(file)) {
      oldcode = file;
      fname = 'syntax';
    } else {
      oldcode = await fsReadFile(file, 'utf8');
    }
    oldcode = oldcode.replace(/\t/g, '    ');
    let prefix = '_es7';
    let syntax = {};
    let { code, warnings } = await lebab.transform(oldcode, opts.lebab);
    if (warnings.length > 0) {
      console.log(`Warning: ${fname} - ${JSON.stringify(warnings)}`.yellow);
    }
    console.log('Parsing file'.green, fname);
    code = await prettyFormat(code);
    syntax[fname] = code;
    return syntax;
  } catch (e) {
    errHandler(`Linter error ${e} ${fname}`);
  }
}

async function getConfig() {
  const optsPath = path.join(basedir, '.es7rc');
  const optsDefault = path.join(__dirname, '.es7rc');
  let userOpts = JSON.stringify({});
  let defaultOpts = JSON.stringify({});
  try {
    if (fs.existsSync(optsPath)) {
      userOpts = await fsReadFile(optsPath, 'utf8');
    }
    defaultOpts = await fsReadFile(optsDefault, 'utf8');
    userOpts = JSON.parse(userOpts);
    defaultOpts = JSON.parse(defaultOpts);
    let data = Object.assign(defaultOpts, userOpts);
    return data;
  } catch (e) {
    errHandler('Invalid configuration file,.es7rc must be a valid JSON');
  }
}

function normalizePath(globs) {
  if (!globs) {
    errHandler('Files path is required');
  }
  if (typeof globs === 'string') {
    globs = [globs];
  }
  if (!Array.isArray(globs)) {
    errHandler(`glob should be String or Array, not ${typeof globs}`);
  }
  return globs;
}

function resolveFilepath(filepath) {
  if (path.isAbsolute(filepath)) {
    return path.normalize(filepath);
  }
  return path.resolve(basedir, filepath);
}

function resolvePath(paths) {
  let mod = '';
  if (paths[0] === '!') {
    mod = paths[0];
    paths = paths.slice(1);
  }
  return mod + slash(resolveFilepath(paths));
}
async function checkRules(opts) {
  let rules = opts.standard ? opts.standard.rules : '';
  pkg.customstandard = {'rules': rules};
  let dir = path.join(__dirname, 'package.json');
  return await fsWriteFile(dir, JSON.stringify(pkg, null, 2));
}
const run = async files => {
  try {
    const options = await getConfig();
    await checkRules(options.format);
    if (Array.isArray(files)) {
      options.files = files.length > 0 ? files : options.files;
      if (options.files) {
        let globs = normalizePath(options.files);
        globs = globs.map(resolvePath);
        let files = await glob(globs);
        if (files.length < 1) {
          errHandler(`File ${options.files} not found`);
        }
        let tasks = files.map(file => es7lint(file, options.format));
        let coderesults = [];
        for (let task of tasks) {
          coderesults.push(await task);
        }
        let writetasks = coderesults.map(wfile => codewriter(wfile, options.out));
        let writeresults = [];
        console.log('Formatting...'.green);
        for (let writetask of writetasks) {
          writeresults.push(await writetask);
        }
        console.log('Format Complete'.cyan);
      }
    } else {
      if (typeof files === 'string') {
        let syntax = await es7lint(files, options.format);
        return syntax;
      }
      console.log('Format Complete'.cyan);
    }
  } catch (e) {
    errHandler(`Run error: ${e} ${e.stack}`);
  }
};
module.exports = run;
