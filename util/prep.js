const fs = require('fs');
const os = require('os');
const eol = os.EOL;
const {promisify} = require('util');
const fsreadfile = promisify(fs.readFile);
const fswritefile = promisify(fs.writeFile);
const pathfiles = ['./es7lint.js', './bin/index.js'];
const fixEol = async f => {
    try {
        var content = await fsreadfile(f, 'utf8');
        content = content.replace(/(?:\r\n|\r|\n)/g, eol);
        return await fswritefile(f, content, 'utf8');
    } catch (e) {
        console.log(e);
    }
};
const runner = async () => {
    for (var i = 0; i < pathfiles.length; i++) {
        await fixEol(pathfiles[i]);
    }
};
runner();