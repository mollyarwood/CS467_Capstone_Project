import React, { Component } from 'react';
import axios from 'axios';

class AddAccount extends Component {
  constructor(props) {
    super(props);

    this.createAccount = this.createAccount.bind(this);
    this.renderErrors = this.renderErrors.bind(this);

    this.state = {
      errors: []
    }
  }

  createAccount(event) {
    event.preventDefault();
      const username = event.target.username.value;
      const password = event.target.password.value;
      axios.post('/createUser', { username, password, userType: 'user' })
        .then((response) => {
          if (response.data.userDetails) {
            this.props.changePage({ target: { name: 'view' } });
          } else if (response.data.errors) {
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
          <h4 className="text-center spacer-bottom">Add {this.props.accountType} Account</h4>
        </div>
        {this.renderErrors()}
          <form className="col-md-4 col-md-offset-4" onSubmit={this.createAccount}>
            <div className="form-group row">
              <label htmlFor="username" className="col-form-label">Create a username:</label>
              <input className="form-control" type="text" name="username" />
            </div>
            <div className="form-group row">
              <label htmlFor="password" className="col-form-label">Create a password:</label>
              <input className="form-control" type="password" name="password" />
            </div>
            <div className="row">
              <button className="btn btn-primary" type='submit'>Create {this.props.accountType}</button>
              <button className="btn pull-right" type="button" name='view' onClick={this.props.changePage}>Cancel</button>
            </div>
          </form>
      </div>
    );
  }
}

export default AddAccount;
