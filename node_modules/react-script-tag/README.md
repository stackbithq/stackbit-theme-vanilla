# react-script-tag

[![Greenkeeper badge](https://badges.greenkeeper.io/adam-26/react-script-tag.svg)](https://greenkeeper.io/)
[![npm](https://img.shields.io/npm/v/react-script-tag.svg)](https://www.npmjs.com/package/react-script-tag)
[![npm](https://img.shields.io/npm/dm/react-script-tag.svg)](https://www.npmjs.com/package/react-script-tag)
[![CircleCI branch](https://img.shields.io/circleci/project/github/adam-26/react-script-tag/master.svg)](https://circleci.com/gh/adam-26/react-script-tag/tree/master)
[![Code Climate](https://img.shields.io/codeclimate/coverage/github/adam-26/react-script-tag.svg)](https://codeclimate.com/github/adam-26/react-script-tag)
[![Code Climate](https://img.shields.io/codeclimate/github/adam-26/react-script-tag.svg)](https://codeclimate.com/github/adam-26/react-script-tag)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)


#### Features:
 * A React `<script>` tag that supports universal rendering
 * Client rendering correctly appends the script tag to the page
 * Supports client `hydrate()`
 * Works with react dev-tools
 * Supports `onLoad` and `onError` callbacks

If you've found this page, you may want to **consider using [react-html-metadata](github.com/adam-26/react-html-metadata)**. It should simplify your use of metadata in React web applications.

### Install

##### NPM

```js
npm install --save react-script-tag
```

##### Yarn

```js
yarn add react-script-tag
```

### Example

```js
import React, { Component } from 'react';
import ScriptTag from 'react-script-tag';

class Demo extends Component {

    render() {
        return (<ScriptTag isHydrating={true} type="text/javascript" src="some_script.js" />);
    }
}
```

### API

All standard `<script>` attributes should be supported, including `onLoad` and `onError` callbacks.

**isHydrating**: `boolean`
Must be `true` if the client is `hydrate()`ing the server render, otherwise `false`. Defaults to `false`.

### Contribute
For questions or issues, please [open an issue](https://github.com/adam-26/react-script-tag/issues), and you're welcome to submit a PR for bug fixes and feature requests.

Before submitting a PR, ensure you run `npm test` to verify that your coe adheres to the configured lint rules and passes all tests. Be sure to include unit tests for any code changes or additions.

### License
MIT