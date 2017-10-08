import React, { Component } from 'react';

class Login extends Component {
  constructor(props) {
    super(props);
    this.renderErrors = this.renderErrors.bind(this);
  }

  renderErrors() {
    if(this.props.errors.length !== 0) {
      return <div className="alert alert-danger col-md-6 col-md-offset-3"><ul>
        {this.props.errors.map(error => <li key={error}>{error}</li>)}
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
        <form className="col-md-4 col-md-offset-4" onSubmit={this.props.logIn}>
          <div className="form-group row">
            <label htmlFor="userName" className="col-form-label">User Name</label>
            <input className="form-control" type="text" id="userName" name="userName" />
          </div>
          <div className="form-group row">
            <label htmlFor="password" className="col-form-label">Password</label>
            <input className="form-control" type="password" id="password" name="password" />
          </div>
          <div className="row">
          <button className="btn btn-primary" type='submit'>Log In</button>
        </div>
        </form>
      </div>
    );
  }
}

export default Login;
