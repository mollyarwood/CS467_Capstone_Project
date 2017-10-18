import React, { Component } from 'react';
import axios from 'axios';

import Login from './Login';
import NormalHome from './NormalHome';
import AdminHome from './AdminHome';

class App extends Component {
  constructor(props) {
    super(props);

    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);

    this.state = {
      loading: true
    };
  }

  componentWillMount() {
    axios.get('/auth').then((response) => {
      if(response.data.loggedIn) {
        this.setState({
          loggedIn: true,
          userType: response.data.userType
        });
      }
      this.setState({ loading: false});
    })
  }

  logIn(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    axios.post('/auth', { username, password })
      .then((response) => {
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
    })
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
    if(this.state.loading) {
      return <div><h1>LOADING...</h1></div>;
    } else if(this.state.loggedIn && this.state.userType === "admin") {
      return <AdminHome logOut={this.logOut} />;
    } else if(this.state.loggedIn && this.state.userType === "normal") {
      return <NormalHome logOut={this.logOut} />;
    } else {
      return <Login logIn={this.logIn} errors={this.state.errors}/>;
    }
  }
}

export default App;
