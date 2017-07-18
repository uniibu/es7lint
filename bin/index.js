#!/usr/bin/env node
const program = require('commander');
const pckjson = require('../package.json');
const es7lint = require('../es7lint');
const version = pckjson.version;
program.version(version).usage('files blobs dir').parse(process.argv);
run(program.args);
function run(arg) {
    es7lint(arg);
}