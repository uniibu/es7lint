const esprima = require('esprima');
const escodegen = require('escodegen');
const {promisify} = require('util');
const colors = require('colors');
const fs = require('fs');
const path = require('path');
const lebab = require('lebab');
const glob = require('globby');
const basedir = process.cwd();
const fsReadFile = promisify(fs.readFile);
const fsWriteFile = promisify(fs.writeFile);
const slash = require('slash');
function errHandler(e, msg = e) {
    console.log('[es7lint]:'.cyan, msg.red);
    process.exit(0);
}
async function es7lint(file, opts, out) {
    try {
        let oldcode = await fsReadFile(file, 'utf8');
        let prefix = '_es7';
        let syntax;
        syntax = esprima.parse(oldcode, opts.esprima);
        syntax = escodegen.attachComments(syntax, syntax.comments, syntax.tokens);
        oldcode = escodegen.generate(syntax, opts.escodegen);
        const {code, warnings} = await lebab.transform(oldcode, opts.lebab);
        if (warnings.length > 0) {
            console.warn(warnings);
        }
        if (out == 'prefix') {
            let parts = path.parse(file);
            let fname = parts.name + prefix + parts.ext;
            file = path.join(parts.dir, fname);
        }
        await fsWriteFile(file, code);
    } catch (e) {
        errHandler(e);
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
        errHandler(`glob should be String or Array, not ${ typeof globs }`);
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
    var mod = '';
    if (paths[0] === '!') {
        mod = paths[0];
        paths = paths.slice(1);
    }
    return mod + slash(resolveFilepath(paths));
}
const run = async files => {
    try {
        const options = await getConfig();
        options.files = files.length > 0 ? files : options.files;
        if (options.files) {
            let globs = normalizePath(options.files);
            globs = globs.map(resolvePath);
            let files = await glob(globs);
            if (files.length < 1) {
                errHandler(`File ${ options.files } not found`);
            }
            let tasks = files.map(async file => {
                return await es7lint(file, options.format, options.output);
            });
            await Promise.all(tasks);
            console.log('Format Complete');
        }
    } catch (e) {
        errHandler(e);
    }
};
module.exports = run;