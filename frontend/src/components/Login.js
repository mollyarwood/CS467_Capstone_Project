import React, { Component } from 'react';
import axios from 'axios';

class Login extends Component {
  constructor(props) {
    super(props);
    this.renderErrors = this.renderErrors.bind(this);
    this.logIn = this.logIn.bind(this);

    this.state = {
      errors: []
    };
  }


  logIn(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    axios.post('/auth', { username, password })
      .then((response) => {
        if (response.data.loggedIn) {
          this.props.setLoggedIn(response.data);
        } else {
          this.setState({
            errors: [ response.data.errors ]
          });
        }
      })
  }

  renderErrors() {
    if(this.state.errors.length !== 0) {
      return <div className="alert alert-danger col-md-6 col-md-offset-3"><ul>
        {this.state.errors.map(error => <li key={error}>{error}</li>)}
      </ul></div>
    }
    return <div></div>;
  }

  render() {
    return (
      <div>
        <div>
          <h2 id="welcome" className="text-center">Welcome to Recognition Award Maker!</h2>
        </div>
        {this.renderErrors()}
        <form className="col-md-4 col-md-offset-4" onSubmit={this.logIn}>
          <div className="form-group row">
            <label htmlFor="username" className="col-form-label">Username</label>
            <input className="form-control" type="text" name="username" />
          </div>
          <div className="form-group row">
            <label htmlFor="password" className="col-form-label">Password</label>
            <input className="form-control" type="password" name="password" />
          </div>
          <div className="row">
          <button className="btn btn-primary" type='submit'>Log In</button>
          <button className="btn pull-right" type="button" name='recover' onClick={this.props.changePage}>Forgot Password?</button>
        </div>
        </form>
      </div>
    );
  }
}

export default Login;
