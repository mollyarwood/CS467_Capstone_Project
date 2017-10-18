import React, { Component } from 'react'
import axios from 'axios'

import Login from './Login';
import NormalHome from './NormalHome';
import AdminHome from './AdminHome';

class App extends Component {
  constructor(props) {
      super(props);

      this.loggedIn = this.loggedIn.bind(this);
      this.logIn = this.logIn.bind(this);
      this.logout = this.logout.bind(this);

      this.state = {
        loading: true,
        loggedIn: false,
        userType: null
      };

      this.loggedIn();
  }

  loggedIn() {
    axios.get('/auth').then(function (response) {
      if(response.data.loggedIn) {
        this.setState({
          loggedIn: true,
          userType: response.data.userType
        });
      }
      this.setState({ loading: false});
    }.bind(this))
  }

  logIn(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    axios.post('/auth', {
          username,
          password
        })
        .then(function (response) {
      if(response.data.loggedIn) {
        this.setState({
          loggedIn: true,
          userType: response.data.userType,
          errors: null
        });
      } else {
        this.setState({
          errors: response.data.errors
        });
      }
    }.bind(this))
  }

  logout() {
    axios.get('/logout').then(function (response) {
      this.setState({
        loggedIn: false,
        userType: null
      });
    }.bind(this))
  }

  render() {
    if(this.state.loading) {
      return <div><h1>LOADING...</h1></div>;
    }
    else if(this.state.loggedIn && this.state.userType === "admin") {
      return <AdminHome logout={this.logout}/>;
    }
    else if(this.state.loggedIn && this.state.userType === "normal") {
      return <NormalHome />;
    }
    else {
      return <Login logIn={this.logIn} errors={this.state.errors}/>;
    }
  }
}

export default App;
