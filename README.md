# es7lint

[![Node version](https://img.shields.io/badge/Node-8.1.4-blue.svg)](http://nodejs.org/download/)
[![Build Status](https://api.travis-ci.org/uniibu/es7lint.svg?branch=master)](https://travis-ci.org/uniibu/es7lint)
[![David deps](https://david-dm.org/uniibu/es7lint.svg)](https://david-dm.org/uniibu/es7lint)

A Javascript code syntax-fixer using the new features from ES6 and ES7.

### Requirements
- Node V8.x and higher for Async/Await and Promisify features.

### Install
```js
//for local use
npm install es7lint --save
//for development use
npm install es7lint --save-dev
//for global use
npm install es7lint -g
```
### Options

`.es7rc` is where es7lint reads the options. Simple create a `.es7rc` file on your application root and put all options on this file.
`es7lint` uses [Esprima](https://www.npmjs.com/package/esprima), [Escodegen](https://www.npmjs.com/package/escodegen) and [Lebab](https://www.npmjs.com/package/lebab) to
format and fix your code syntax. All options available on the said modules are also available on es7lint. 

`.es7rc` must have the following format:
```js
{
  "files": ["*.js"], /** glob pattern for files to format */
  "output": "inherit", /** set this to inherit or prefix */
  "format": {
    "escodegen": {
      /** escodegen options */
    },
    "esprima": {
      /** esprima options */
    },
    "lebab": [/** lebab options */]
  }
}
```

#### `files`
Is a glob pattern for all files that you want to format. This can be an array of globs or a single glob string.

#### `output`
- `inherit` will write the formatted code to the same file.
- `prefix` will write the formatted code to the same directory with new filename prefixed with `_es7`. (`filename_es7.js`)

#### `format`
Is where all options pertaining to Esprima, Escodegen and Lebab goes to.

### Usage

If `.es7rc` is missing on your root directory, it will use the default options found on the module's folder

```js
//local usage
node ./node_modules/.bin/es7lint
//global usage
node es7lint
```

### Errors

- `es7lint` also checks for any syntax errors before saving them, and will output any errors found.
- If an error is found, `es7lint` will stop formatting and exits.

### Contributions and Issues
Feel free to create a [Pull request](https://github.com/uniibu/es7lint/pulls) and/or [Submit an Issue](https://github.com/uniibu/es7lint/issues)