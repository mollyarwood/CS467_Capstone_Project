import React, {Component} from 'react';

class NormalHome extends Component {
  render() {
    return (
      <div>
        <h1>User</h1>
        <button onClick={this.props.logOut}>Log Out</button>
      </div>
    );
  }
}

export default NormalHome;
