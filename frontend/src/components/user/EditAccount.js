import React, { Component } from 'react';

class EditAccount extends Component {
  constructor(props) {
      super(props);

      this.renderErrors = this.renderErrors.bind(this);
      this.updateUsername = this.updateUsername.bind(this);
      this.updateName = this.updateName.bind(this);
      this.updatePassword = this.updatePassword.bind(this);

      this.state = {
        errors: []
      };
  }

  renderErrors() {
    if(this.state.errors.length !== 0) {
      return <div className="alert alert-danger col-md-6 col-md-offset-3"><ul>
        {this.state.errors.map(error => <li key={error}>{error}</li>)}
      </ul></div>
    }
    return <div></div>;
  }

  updateUsername(event) {
    event.preventDefault();
    alert('username');
  }

  updateName(event) {
    event.preventDefault();
    alert('name');
  }

  updatePassword(event) {
    event.preventDefault();
    alert('password');
  }

  render() {
    return (
      <div>
        <div>
          <h3 className="text-center spacer-bottom">Edit Account</h3>
        </div>
        <div>
          {this.renderErrors()}
          <div className="col-md-3 col-md-offset-2">
            <form onSubmit={this.updateUsername}>
              <div className="form-group row">
                <label htmlFor="username" className="col-form-label">Username</label>
                <input className="form-control" type="text" name="username" />
              </div>
              <div className="row">
                <button className="btn btn-primary spacer-bottom" type='submit'>Update Username</button>
              </div>
            </form>
            <form onSubmit={this.updateName}>
              <div className="form-group row">
                <label htmlFor="name" className="col-form-label">Name</label>
                <input className="form-control" type="text" id="name" name="name" />
              </div>
              <div className="row">
                <button className="btn btn-primary" type='submit'>Update Name</button>
              </div>
            </form>
          </div>
          <div className="col-md-3 col-md-offset-2">
            <form onSubmit={this.updatePassword}>
              <div className="form-group row">
                <label htmlFor="currentPassword" className="col-form-label"> Current Password</label>
                <input className="form-control" type="password" id="currentPassword" name="currentPassword" />
              </div>
              <div className="form-group row">
                <label htmlFor="newPassword" className="col-form-label"> New Password</label>
                <input className="form-control" type="password" id="newPassword" name="newPassword" />
              </div>
              <div className="form-group row">
                <label htmlFor="confirmPassword" className="col-form-label">Confirm Password</label>
                <input className="form-control" type="password" id="confirmPassword" name="confirmPassword" />
              </div>
              <div className="row">
                <button className="btn btn-primary" type='submit'>Update Password</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default EditAccount;
