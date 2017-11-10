import React, { Component } from 'react';

import SendAward from './SendAward';
import ViewAwards from './ViewAwards';
import EditAccount from './EditAccount';

class UserInterface extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      currentPage: 'ViewAwards'
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
      case 'ViewAwards':
        return <ViewAwards />;
      case 'SendAward':
        return <SendAward changePage={this.changePage} />;
      case 'EditAccount':
        return <EditAccount changePage={this.changePage} />;
      default:
        return <ViewAwards name={this.props.name} />;
    }
  }

  createNavButtons() {
    const tabs = [
      {
      text: 'View Awards',
      name: 'ViewAwards'
      },
      {
        text: 'Send Award',
        name: 'SendAward'
      },
      {
        text: 'Edit Account',
        name: 'EditAccount'
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
          <div className="col-md-11 spacer-bottom"><h1>User Interface</h1></div>
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

export default UserInterface;
