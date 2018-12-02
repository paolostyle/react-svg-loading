# react-svg-loading

> Dependency-free loading React components based on loading.io library

[![NPM](https://img.shields.io/npm/v/react-svg-loading.svg)](https://www.npmjs.com/package/react-svg-loading)

## About
Heavily WIP - for now only one usable component. Proper usage and props will be explained once all components
are ready, for now you can check the typings for instructions.

Experimental API and subject to change, should not be used in production (or if anything, please freeze the version).

## Install

```bash
npm install --save react-svg-loading
yarn add react-svg-loading
```

## Usage

```jsx
import React, { Component } from 'react'
import { FillImageLoading } from 'react-svg-loading'

class Example extends Component {
  render () {
    return (
      <FillImageLoading value={12} />
    )
  }
}
```

## License

MIT © [paolostyle](https://github.com/paolostyle)
