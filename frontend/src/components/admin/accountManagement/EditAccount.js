import React, { Component } from 'react';

class EditAccount extends Component {
  render() {
    return (
      <div>
        <h3>Edit user</h3>
        <button className="btn" name='view' onClick={this.props.changePage}>Cancel</button>
      </div>
    );
  }
}

export default EditAccount;
