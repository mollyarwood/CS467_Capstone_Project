import React, { Component } from 'react';
import axios from 'axios';

import AddUserAccount from './AddUserAccount';

class ManageUserAccounts extends Component {
  constructor(props) {
      super(props);
      this.state = {
        currentPage: 'view',
        users: [
        ]
      }

      this.deleteUser = this.deleteUser.bind(this);
      this.changePage = this.changePage.bind(this);
  }

  componentWillMount() {
    axios.get('/test').then((response) => {
      if (response.data.users) {
        this.setState({
          users: response.data.users
        });
      }
    });
  }

  deleteUser(event) {
    const userId = parseInt(event.target.id, 10);

    axios.delete('/test').then((response) => {
      const newUserList = this.state.users
        .filter(user => user.id !== userId);
      this.setState({
        users: newUserList
      });
    });
  }

  changePage(event) {
    const newPage = event.target.name;
    this.setState({
      currentPage: newPage
    });
  }

  render() {
    if (this.state.currentPage === 'add') {
      return <AddUserAccount changePage={this.changePage} />;
    } else if (this.state.currentPage === 'edit') {
      return (
        <div>
          <h3>Edit user</h3>
          <button className="btn" name='view' changePage={this.changePage}>Cancel</button>
        </div>
      );
    } else if (this.state.currentPage === 'view') {
      return (
        <div>
          <div>
            <button className="btn btn-primary spacer-bottom" name="add" onClick={this.changePage}>
              Add User
            </button>
          </div>
          <table className="table">
            <thead>
              <tr className="row">
                <th className="col-md-5">Username</th>
                <th className="col-md-5">Name</th>
                <th className="col-md-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.users.map( user =>
                <tr className="row" key={user.id}>
                  <td className="col-md-5">{user.name}</td>
                  <td className="col-md-5">{user.name}</td>
                  <td className="col-md-1">
                    <button id={user.id} className="btn btn-default" name="edit" onClick={this.changePage}>
                      Edit
                    </button>
                  </td>
                  <td className="col-md-1">
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
}

export default ManageUserAccounts;
