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
        accounts: []
      }

      this.deleteAccount = this.deleteAccount.bind(this);
      this.changePage = this.changePage.bind(this);
  }

  componentWillMount() {
    axios.get('/accounts').then((response) => {
      if (response.data.accounts) {
        this.setState({
          accounts: response.data.accounts
        });
      }
    });
  }

  deleteAccount(event) {
    const accountId = parseInt(event.target.id, 10);

    axios.delete('/ROUTE-HERE').then((response) => {
      const newAccountList = this.state.accounts
        .filter(account => account.id !== accountId);
      this.setState({
        accounts: newAccountList
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
      return <AddAccount accountType={this.state.accountType} changePage={this.changePage} />
    } else if (this.state.currentPage === 'edit') {
      return <EditAccount changePage={this.changePage} />
    } else if (this.state.currentPage === 'view') {
      return (
        <ViewAccounts
          changePage={this.changePage}
          deleteAccount={this.deleteAccount}
          accounts={this.state.accounts}
          accountType={this.state.accountType}
        />
      );
    }
  }
}

export default AccountManagement;
