# Next.js + co-located Jest tests

Use [Next.js](https://github.com/zeit/next.js) without [Jest](https://facebook.github.io/jest/) tests in your build.

## Example

```shell
# you can now have your tests here
pages/__tests__/home-test.js
pages/home.js
# instead of in the root
__tests__/home-test.js
```

## Installation

```
npm install --save next-without-jest
```

or

```
yarn add next-without-jest
```

## Usage

Create a `next.config.js` in your project

```js
// next.config.js
const withoutJest = require('next-without-jest')()
module.exports = withoutJest()
```

This plugin uses `jest-config` package, the same that Jest uses.
Any custom configuration for `testMatch` or `testRegex` that you might use in your Jest setup is supported automatically.

The current working directory for your process is used when looking up your Jest project configuration.

The default behavior is overridable:

```js
// next.config.js
const withoutJest = require('next-without-jest')({
  // the directory used to search for your project configuration
  // default: process.cwd()
  cwd: __dirname,
  // if the automatic project configuration can't be used or found, pass a regex pattern directly
  testPattern: /__tests__/,
})
module.exports = withoutJest()
```

Optionally you can add your custom Next.js configuration as parameter

```js
// next.config.js
const withoutJest = require('next-without-jest')()
module.exports = withoutJest({
  webpack(config, options) {
    return config
  },
})
```
