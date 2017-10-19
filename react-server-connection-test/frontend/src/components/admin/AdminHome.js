import React, { Component } from 'react';

class AdminHome extends Component {
  render() {
    return (
      <div>
        <h1>Admin Home</h1>
        <div><button>Manage User Accounts</button></div>
        <div><button>Manage Admin Accounts</button></div>
        <div><button>Business Intelligence</button></div>
        <div><button onClick={this.props.logOut}>Log Out</button></div>
      </div>
    );
  }
}

export default AdminHome;
