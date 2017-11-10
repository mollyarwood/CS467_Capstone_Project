import React, { Component } from 'react';
import axios from 'axios';
import ReactSpinner from 'react-spinjs';
import _ from 'lodash';

class ViewAccounts extends Component {
  constructor(props) {
      super(props);

      this.state = {
        accounts: [],
        isLoading: true
      }

      this.deleteAccount = this.deleteAccount.bind(this);
      this.openEditAccount = this.openEditAccount.bind(this);
  }

  componentWillMount() {
    axios.get(`/accounts?type=${_.lowerCase(this.props.accountType)}`)
      .then((response) => {
        if (response.data.accounts) {
          this.setState({
            accounts: response.data.accounts,
            isLoading: false
          });
        }
      });
  }

  openEditAccount(event) {
    const accountId = event.target.id;
    const accountInfo = _.find(this.state.accounts, account => account.id === accountId);
    this.props.changeSelectedUser(accountInfo);
    this.props.changePage(event);
  }

  deleteAccount(event) {
    event.preventDefault();
    const accountId = event.target.id;
    const url = '/accounts/' + accountId;

    axios.delete(url).then((response) => {
      if (response.data.deleted) {
        const newAccountList = this.state.accounts
          .filter(account => account.id !== accountId);
        this.setState({
          accounts: newAccountList
        });
      }
    });
  }

  render() {
    if (this.state.isloading) {
      return <ReactSpinner config={{ width: 5, radius: 18 }} />;
    } else {
      return (
        <div>
          <div>
            <button className="btn btn-primary spacer-bottom" name="add" onClick={this.props.changePage}>
              Add {this.props.accountType}
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
              {
                this.state.accounts.map( account =>
                  <tr className="row" key={account.id}>
                    <td className="col-md-5">{account.username}</td>
                    <td className="col-md-5">{account.name || 'None'}</td>
                    <td className="col-md-1">
                      <button
                        id={account.id}
                        className="btn btn-default"
                        name="edit"
                        onClick={this.openEditAccount}>
                        Edit
                      </button>
                    </td>
                    <td className="col-md-1">
                      <button id={account.id} className="btn btn-danger" onClick={this.deleteAccount}>
                        Delete
                      </button>
                    </td>
                  </tr>)
                }
              </tbody>
            </table>
          </div>
      );
    }
  }
}

export default ViewAccounts;
