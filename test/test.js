const assert = require('assert');
const {promisify} = require('util');
const exec = promisify(require('child_process').exec);
describe('Check for successfull format', () => {
    it('should log Format Complete on success', async () => {
        const {stdout, stderr} = await exec('node es7lint.js');
        var res = stdout.toString().trim();
        assert(res === 'Format Complete', `Error, value was ${ res }`);
    });
});
describe('Check if no syntax errors on formatted file', () => {
    it('should return blank if no errors', async () => {
        const {stdout, stderr} = await exec('node --check ./test/files/index.js');
        var res = stdout.toString().trim();
        assert(res === '', `Error, value was ${ res }`);
    });
});