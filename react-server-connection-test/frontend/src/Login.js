import React, { Component } from 'react';

class Login extends Component {
  constructor(props) {
    super(props);
    this.renderErrors = this.renderErrors.bind(this);
  }

  renderErrors() {
    return <div>{this.props.errors}</div>
  }

  render() {
    return (
    <div>
      <h1>Log In</h1>
      {this.renderErrors()}
      <form onSubmit={this.props.logIn}>
        <div>Username: <input type="text" name="username" /></div>
        <div>Password: <input type="password" name="password" /></div>
        <div><button type='submit'>Log In</button></div>
      </form>
    </div>
    );
  }
}

export default Login;
