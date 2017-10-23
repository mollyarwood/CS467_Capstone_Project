import React, { Component } from 'react';

import BussinessIntelligence from './BussinessIntelligence';
import AccountManagement from './accountManagement/AccountManagement';

class AdminInterface extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      currentPage: 'BussinessIntelligence'
    });

    this.changePage = this.changePage.bind(this);
    this.renderCurrentPageContent = this.renderCurrentPageContent.bind(this);
  }

  changePage(event) {
    const newPage = event.target.name;
    this.setState({
      currentPage: newPage
    });
  }

  renderCurrentPageContent() {
    switch(this.state.currentPage) {
      case 'BussinessIntelligence':
        return <BussinessIntelligence />;
      case 'ManageUserAccounts':
        return <AccountManagement key="admin" type="User" />;
      case 'ManageAdminAccounts':
        return <AccountManagement key="user" type="Admin" />;
      default:
        return <div></div>;
    }
  }

  createNavButtons() {
    const tabs = [
      {
      text: 'Business Intelligence',
      name: 'BussinessIntelligence'
      },
      {
        text: 'Manage User Accounts',
        name: 'ManageUserAccounts'
      },
      {
        text: 'Manage Admin Accounts',
        name: 'ManageAdminAccounts'
      }
    ];

    return tabs.map(tab => {
      let className = "nav-link";
      if (this.state.currentPage === tab.name) {
        className += " active";
      }
      return (
        <li className="nav-item" key={tab.name}>
          <a className={className}
            name={tab.name}
            onClick={this.changePage}
          >{tab.text}</a>
        </li>
      );
    });
  }

  render() {
    return (
      <div className="col-md-10 col-md-offset-1">
        <div className="row">
          <div className="col-md-11 spacer-bottom"><h1>Admin Interface</h1></div>
          <div className="col-md-1 pull-right">
            <button className="btn btn-primary" onClick={this.props.logOut}>Log Out</button>
          </div>
        </div>

        <ul className="nav nav-tabs">
          {this.createNavButtons()}
        </ul>
        <div className="userContent">
          {this.renderCurrentPageContent()}
        </div>

      </div>
    );
  }

}

export default AdminInterface;
