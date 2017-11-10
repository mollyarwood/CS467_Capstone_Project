import React, { Component } from 'react';
import axios from 'axios';

import AddAccount from './AddAccount';
import EditAccount from './EditAccount';
import ViewAccounts from './ViewAccounts'

class AccountManagement extends Component {
  constructor(props) {
      super(props);

      this.state = {
        accountType: this.props.type,
        currentPage: 'view',
        selectedUser: null
      }

      this.changePage = this.changePage.bind(this);
      this.changeSelectedUser = this.changeSelectedUser.bind(this);
  }

  changePage(event) {
    const newPage = event.target.name;
    this.setState({
      currentPage: newPage
    });
  }

  changeSelectedUser(newUser) {
      this.setState({ selectedUser: newUser });
  }

  render() {
    if (this.state.currentPage === 'add') {
      return (
        <AddAccount
          accountType={this.state.accountType}
          changePage={this.changePage}
        />
      );
    } else if (this.state.currentPage === 'edit') {
      return (
        <EditAccount
          changePage={this.changePage}
          accountInfo={this.state.selectedUser}
        />
      );
    } else if (this.state.currentPage === 'view') {
      return (
        <ViewAccounts
          changePage={this.changePage}
          changeSelectedUser={this.changeSelectedUser}
          accountType={this.state.accountType}
        />
      );
    }
  }
}

export default AccountManagement;
