# es7lint

[![Node version](https://img.shields.io/badge/Node-8.1.4-blue.svg)](http://nodejs.org/download/)
[![Build Status](https://api.travis-ci.org/uniibu/es7lint.svg?branch=master)](https://travis-ci.org/uniibu/es7lint)
[![David deps](https://david-dm.org/uniibu/es7lint.svg)](https://david-dm.org/uniibu/es7lint)

A Javascript code syntax-fixer using the new features from ES6 and ES7.

### Goal
Why did you made this module, if people can just use Lebab or Custom-standard?
- Lebab on its own is pretty nice, but the output formatting is not that readable specially on
long arrays/objects.
- Prettier itself is a beautifier which is used by some bigger companies, but is not a transpiler, it
doesn't transform your code to ES6/ES7 syntax.
- So instead of using individually to attain a better syntax, i made this.

### Requirements
- Node V8.x and higher for Async/Await and Promisify features.

### Features
- Converts your codes to a readable syntax using the latest features from ES6/ES7
- Customizable, you can set how you like you code to look.

### Caveats
- Since this module relies on both Lebab and Prettier, their `caveats` are also this module's caveats.

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
`es7lint` uses [Lebab](https://www.npmjs.com/package/lebab) and [Custom-Standard](https://github.com/uniibu/custom-standard) to
format and fix your code syntax. All options available on the said modules are also available on es7lint. 

`.es7rc` must have the following format:
```js
{
  "files": ["*.js"], /** glob pattern for files to format */
  "output": "inherit", /** set this to inherit or prefix */
  "format": {
    "lebab": [/** lebab options */],
    "standard": {
		"rules": {
  			"space-before-function-paren": [2, "never"]
		}
    }
  }
}
```

#### `files`
Is a glob pattern for all files that you want to format. This can be an array of globs or a single glob string.

#### `output`
- `inherit` will write the formatted code to the same file.
- `prefix` will write the formatted code to the same directory with new filename prefixed with `_es7`. (`filename_es7.js`)

#### `format`
Is where all options pertaining to Lebab goes to.

### Usage

If `.es7rc` is missing on your root directory, it will use the default options found on the module's folder
If an argument is passed via cli(command) this will override the files set on your `.es7rc`

```js
//local usage
./node_modules/.bin/es7lint src/*.js scripts/**/*.js
//global usage
es7lint src/*.js scripts/**/*.js
```

### Errors

- `es7lint` also checks for any syntax errors before saving them, and will output any errors found.
- If an error is found, `es7lint` will stop formatting and exits.

### Contributions and Issues
Feel free to create a [Pull request](https://github.com/uniibu/es7lint/pulls) and/or [Submit an Issue](https://github.com/uniibu/es7lint/issues)