import React, { Component } from 'react';
import axios from 'axios';

class EditAccount extends Component {
  constructor(props) {
    super(props);

    this.editAccount = this.editAccount.bind(this);
    this.renderErrors = this.renderErrors.bind(this);

    this.state = {
      errors: []
    }
  }

  editAccount(event) {
    event.preventDefault();
      const username = event.target.username.value;
      const password = event.target.password.value;
      axios.post('/accounts',
        {
          username,
          password,
          userType: _.lowerCase(this.props.accountType)
        })
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
          <h4 className="text-center spacer-bottom">Edit USERNAME's Account</h4>
        </div>
        {this.renderErrors()}
          <form className="col-md-4 col-md-offset-4" onSubmit={this.editAccount}>
            <div className="form-group row">
              <label htmlFor="username" className="col-form-label">Username:</label>
              <input className="form-control" type="text" name="username" />
            </div>
            <div className="form-group row">
              <label htmlFor="name" className="col-form-label">Name:</label>
              <input className="form-control" type="text" name="name" />
            </div>
            <div className="form-group row">
              <label htmlFor="password" className="col-form-label">Password:</label>
              <input className="form-control" type="password" name="password" />
            </div>
            <div className="row">
              <button className="btn btn-primary" type='submit'>Update Account</button>
              <button className="btn pull-right" type="button" name='view' onClick={this.props.changePage}>Cancel</button>
            </div>
          </form>
      </div>
    );
  }
}

export default EditAccount;
