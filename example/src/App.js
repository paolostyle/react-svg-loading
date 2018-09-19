import React, { Component } from 'react';
import { AnimatedGradient, AnimatedBubble, AnimatedStripe } from 'react-svg-loading';

export default class App extends Component {
  render() {
    return (
      <div>
        <AnimatedGradient />
        <AnimatedBubble />
        <AnimatedStripe />
      </div>
    );
  }
}
