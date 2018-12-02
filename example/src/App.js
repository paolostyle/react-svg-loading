import React, { Component } from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { ImageLoading } from 'react-svg-loading';
import pilot from './pilot.png';

export function encodeSvg(reactElement) {
  return 'data:image/svg+xml,' + escape(ReactDOMServer.renderToStaticMarkup((reactElement)));
}

export default class App extends Component {
  render() {
    return (
      <div>
        <ImageLoading image={pilot} />
      </div>
    );
  }
}
