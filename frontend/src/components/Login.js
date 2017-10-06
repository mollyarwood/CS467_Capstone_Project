import React, { Component } from 'react';

export default class Login extends Component {
  render() {
    return (
      <div>
        <h1>Login Page</h1>
          <button className="btn" onClick={this.props.onClick}>Log In</button>
      </div>
    );
  }
}
