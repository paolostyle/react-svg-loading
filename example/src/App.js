import React, { Component } from 'react';
import { FillImageLoading } from 'react-svg-loading';
import icon from './react-icon.svg';

export default class App extends Component {
  timeoutId = 0;

  state = {
    value: 42,
    inputVal: 42
  };

  randomValues = () => {
    this.timeoutId = setInterval(() => this.setState({ value: Math.random() * 100 }), 750);
  };

  cancelRandom = () => {
    clearInterval(this.timeoutId);
  };

  render() {
    return (
      <div>
        <FillImageLoading image={icon} value={this.state.value} imageSize={{ width: 300, height: 200}} duration={0.75} timingFunction="ease-out" fillBackgroundExtrude={1} />
        <div>{this.state.value}</div>
        <input onChange={e => this.setState({inputVal: e.target.value})} value={this.state.inputVal} />
        <button onClick={() => this.setState({ value: this.state.inputVal })}>set</button>
        <input type="checkbox" onChange={e => e.target.checked ? this.randomValues() : this.cancelRandom()} /> Randomize
      </div>
    );
  }
}
