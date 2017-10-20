import React, { Component } from 'react';

class AddUserAccount extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div>
          <h4 id="" className="text-center spacer-bottom">Add User Account</h4>
        </div>
          <form className="col-md-4 col-md-offset-4">
            <div className="form-group row">
              <label htmlFor="username" className="col-form-label">Create a username:</label>
              <input className="form-control" type="text" name="username" />
            </div>
            <div className="form-group row">
              <label htmlFor="password" className="col-form-label">Create a password:</label>
              <input className="form-control" type="password" name="password" />
            </div>
            <div className="row">
              <button className="btn btn-primary" type='submit'>Create User</button>
              <button className="btn pull-right" name='view' onClick={this.props.changePage}>Cancel</button>
            </div>
          </form>
      </div>
    );
  }
}

export default AddUserAccount;
