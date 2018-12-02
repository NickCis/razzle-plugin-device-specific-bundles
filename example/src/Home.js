import React, { Component } from 'react';
import logo from './react.svg';
import './Home.css';
import Text from './Text';

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <div className="Home-header">
          <img src={logo} className="Home-logo" alt="logo" />
          <h2>Welcome to Razzle</h2>
        </div>
        <p className="Home-intro">
          To get started, edit
          {' '}
          <code>src/App.js</code>
          {' '}
          or
          {' '}
          <code>src/Home.js</code>
          {' '}
          and save to reload.
        </p>
        <p>
          Device
          {' '}
          <code>{process.device}</code>
          {' '}
          .
        </p>
        <Text />
        <ul className="Home-resources">
          <li><a href="https://github.com/jaredpalmer/razzle">Docs</a></li>
          <li>
            <a href="https://github.com/jaredpalmer/razzle/issues">Issues</a>
          </li>
          <li><a href="https://palmer.chat">Community Slack</a></li>
        </ul>
      </div>
    );
  }
}

export default Home;
