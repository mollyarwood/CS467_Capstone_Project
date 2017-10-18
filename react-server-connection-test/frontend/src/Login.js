import React, { Component } from 'react';
import axios from 'axios';

class Login extends Component {
  constructor(props) {
    super(props);
    this.renderErrors = this.renderErrors.bind(this);
    this.logIn = this.logIn.bind(this);

    this.state = {};
  }

  logIn(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    axios.post('/auth', { username, password })
      .then((response) => {
        if (response.data.loggedIn) {
          this.props.onLogIn(response.data);
        } else {
          this.setState({
            errors: response.data.errors
          });
        }
    })
  }

  renderErrors() {
    return <div>{this.state.errors}</div>;
  }

  render() {
    return (
      <div>
        <h1>Log In</h1>
        {this.renderErrors()}
        <form onSubmit={this.logIn}>
          <div>Username: <input type="text" name="username" /></div>
          <div>Password: <input type="password" name="password" /></div>
          <div><button type='submit'>Log In</button></div>
        </form>
      </div>
    );
  }
}

export default Login;
