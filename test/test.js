const assert = require('assert');
const { promisify } = require('util');
const { spawn } = require('child_process');
const exec = require('child_process').exec;
describe('Check for successfull format', () => {
  it('should exit on code 0 on success', () => {
    let child1 = spawn('node', ['./bin/index.js']);
    child1.stdout.on('close', code => {
      assert(code === 0, `Error, value was ${code}`);
    });
  });
});
describe('Check for override files on config', () => {
  it('should exit on code 0 on success', () => {
    let child2 = spawn('node', ['./bin/index.js ./test/files/index2.js']);
    child2.stdout.on('close', code => {
      assert(code === 0, `Error, value was ${code}`);
    });
  });
});
describe('Check if no syntax errors on formatted file', () => {
  it('should return blank if no errors', async () => {
    const { stdout, stderr } = await exec('node --check ./test/files/index.js');
    let child3 = spawn('node', ['--check', './test/files/index.js']);
    child3.stdout.on('data', data => {
      assert(data === '', `Error value was ${data}`);
    });
    child3.stdout.on('close', code => {
      assert(code === 0, `Error, value was ${code}`);
    });
  });
});
