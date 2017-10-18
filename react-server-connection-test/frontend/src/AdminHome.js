import React, {Component} from 'react';

class AdminHome extends Component {
  render() {
    return (
      <div>
        <h1>Admin</h1>
        <button onClick={this.props.logout}>Logout</button>
      </div>
    );
  }
}

export default AdminHome;
