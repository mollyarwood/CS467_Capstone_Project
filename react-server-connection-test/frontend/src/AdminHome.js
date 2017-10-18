import React, {Component} from 'react';

class AdminHome extends Component {
  render() {
    return (
	<div>
      <div>
        <h1>Admin</h1>
        <button onClick={this.props.logOut}>Log Out</button>
      </div>
	  <div>
        <button onClick={this.props.navToAccountManagement}>Account Management</button>
      </div>
	</div>
    );
  }
}

export default AdminHome;
