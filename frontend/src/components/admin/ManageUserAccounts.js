import React, { Component } from 'react';

class ManageUserAccounts extends Component {
  constructor(props) {
      super(props);
      this.state = {
        users: [
          {
            id: 1,
            name: 'User1',
          },
          {
            id: 2,
            name: 'User2',
          }
        ]
      }

      this.deleteUser = this.deleteUser.bind(this);
  }

  deleteUser(event) {
    const userId = parseInt(event.target.id, 10);
    const newUserList = this.state.users
      .filter(user => user.id !== userId);
    this.setState({
      users: newUserList
    });
  }

  render() {
    return (
      <div>
        <div>
          <button className="btn btn-primary" onClick={this.deleteUser}>
            Add User
          </button>
        </div>
        <table className="table">
          <thead>
            <tr className="row">
              <th className="col-md-4">Username</th>
              <th className="col-md-4">Name</th>
              <th className="col-md-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.users.map( user =>
              <tr className="row" key={user.id}>
                <td className="col-md-4">{user.name}</td>
                <td className="col-md-4">{user.name}</td>
                <td className="col-md-2">
                  <button id={user.id} className="btn btn-danger" onClick={this.deleteUser}>
                    Edit
                  </button>
                </td>
                <td className="col-md-2">
                  <button id={user.id} className="btn btn-danger" onClick={this.deleteUser}>
                    Delete
                  </button>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ManageUserAccounts;
