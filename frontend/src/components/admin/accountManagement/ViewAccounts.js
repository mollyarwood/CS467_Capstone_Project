import React, { Component } from 'react';

class ViewAccounts extends Component {
  render() {
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
              this.props.accounts.map( account =>
                <tr className="row" key={account.id}>
                  <td className="col-md-5">{account.name}</td>
                  <td className="col-md-5">{account.name}</td>
                  <td className="col-md-1">
                    <button id={account.id} className="btn btn-default" name="edit" onClick={this.props.changePage}>
                      Edit
                    </button>
                  </td>
                  <td className="col-md-1">
                    <button id={account.id} className="btn btn-danger" onClick={this.props.deleteAccount}>
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

export default ViewAccounts;
