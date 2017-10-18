import React, {Component} from 'react';

class AdminHome extends Component {
  render() {
    return (
      <div>
        <h1>Admin</h1>
        <button onClick={this.props.logOut}>Log Out</button>
      </div>
    );
  }
}

export default AdminHome;
