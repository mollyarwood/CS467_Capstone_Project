import React, { Component } from 'react';
import axios from 'axios';

import Login from './Login';
import NormalHome from './NormalHome';
import AdminHome from './AdminHome';

class App extends Component {
  constructor(props) {
    super(props);

    this.onLogIn = this.onLogIn.bind(this);
    this.logOut = this.logOut.bind(this);

    this.state = {
      loading: true
    };
  }

  componentWillMount() {
    axios.get('/auth').then((response) => {
      if (response.data.loggedIn) {
        this.setState({
          loggedIn: true,
          userType: response.data.userType
        });
      }
      this.setState({ loading: false });
    })
  }

  onLogIn(responseData) {
    this.setState({
      loggedIn: true,
      userType: responseData.userType,
    });
  }

  logOut() {
    axios.get('/logout').then((response) => {
      this.setState({
        loggedIn: false,
        userType: null
      });
    })
  }

  render() {
    if (this.state.loading) {
      return <div><h1>LOADING...</h1></div>;
    } else if (this.state.loggedIn && this.state.userType === "admin") {
      return <AdminHome logOut={this.logOut} />;
    } else if (this.state.loggedIn && this.state.userType === "normal") {
      return <NormalHome logOut={this.logOut} />;
    } else {
      return <Login onLogIn={this.onLogIn} />;
    }
  }
}

export default App;
