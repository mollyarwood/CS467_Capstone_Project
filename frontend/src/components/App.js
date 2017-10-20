import React, { Component } from 'react';
import axios from 'axios';
import ReactSpinner from 'react-spinjs';

import Login from './Login';
import UserHome from './user/UserHome';
import AdminHome from './admin/AdminHome';

class App extends Component {
  constructor(props) {
    super(props);

    this.setLoggedIn = this.setLoggedIn.bind(this);
    this.logOut = this.logOut.bind(this);

    this.state = {
      loading: true
    };
  }

  componentWillMount() {
    axios.get('/auth').then((response) => {
      if (response.data.loggedIn) {
        this.setLoggedIn(response.data);
      }
      this.setState({ loading: false });
    })
  }

  setLoggedIn(responseData) {
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
      return <ReactSpinner config={{ width: 5, radius: 18 }} />;
    } else if (this.state.loggedIn && this.state.userType === "admin") {
      return <AdminHome logOut={this.logOut} />;
    } else if (this.state.loggedIn && this.state.userType === "user") {
      return <UserHome logOut={this.logOut} />;
    } else {
      return <Login setLoggedIn={this.setLoggedIn} />;
    }
  }
}

export default App;
