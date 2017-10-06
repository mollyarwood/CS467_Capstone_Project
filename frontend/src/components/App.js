import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Login from './Login';
import UserHome from './UserHome';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { loggedIn: false };

    this.logIn = this.logIn.bind(this);
  }

  logIn() {
    this.setState({ loggedIn: true });
  }

  render() {
    if(this.state.loggedIn) {
      return(
        <div>
          <h1>You're logged in</h1>
          <UserHome />
        </div>
    );
    } else {
      return(
        <div>
          <h1>You're not logged in</h1>
          <Login onClick={this.logIn} />
        </div>
      );
    }
  }
}

export default App;
