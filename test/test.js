const assert = require('assert');
const {promisify} = require('util');
const exec = promisify(require('child_process').exec);
describe('Check for successfull format', () => {
    it('should log Format Complete on success', async () => {
        const {stdout, stderr} = await exec('node ./bin/index.js');
        var res = stdout.toString().trim();
        assert(res === 'Format Complete', `Error, value was ${ res }`);
    });
});
describe('Check for override files on config', () => {
    it('should log Format Complete on success', async () => {
        const {stdout, stderr} = await exec('node ./bin/index.js ./test/files/index2.js');
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