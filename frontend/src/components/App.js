import React, { Component } from 'react';

import Login from './Login';
import FirstTimeLogin from './FirstTimeLogin';
import UserHome from './user/UserHome';
import AdminHome from './admin/AdminHome';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      errors: []
    };

    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
    this.firstTimeLogin = this.firstTimeLogin.bind(this);
    this.renderLoggedIn = this.renderLoggedIn.bind(this);
  }

  logIn(event) {
    event.preventDefault();
    const errors = [];
    const userName = event.target.userName.value;
    const password = event.target.password.value;
    if (userName.length === 0) {
      errors.push('User name cannot be blank');
    }
    if (password.length === 0) {
       errors.push('password cannot be blank')
    }

    if (errors.length === 0) {
      // Authenticate user with server here, the following is mostly dummy data
      if (userName === 'admin') {
        this.setState({
          loggedIn: true,
          userType: 'admin',
          errors
        });
      } else if (userName === 'normal') {
        this.setState({
          loggedIn: true,
          userType: 'normal',
          errors
        });
      } else if (userName === 'firstTime') {
        this.setState({
          loggedIn: true,
          userType: 'normal',
          firstTimeLogin: true,
          errors
        });
      } else {
        errors.push('Incorrect user name or password');
        this.setState({ errors });
      }
    } else {
      this.setState({ errors });
    }
  }

  logOut() {
    this.setState({
      loggedIn: false,
      userType: null
    });
  }

  firstTimeLogin() {
    this.setState({
      firstTimeLogin: false
    });
  }

  renderLoggedIn() {
    if(this.state.firstTimeLogin) {
      return <FirstTimeLogin firstTimeLogin={this.firstTimeLogin} />;
    } else if(this.state.userType === 'normal') {
      return (<UserHome onLogOut={this.logOut} />);
    } else if(this.state.userType === 'admin') {
      return (<AdminHome onLogOut={this.logOut} />);
    }
  }

  render() {
    if(this.state.loggedIn) {
      return this.renderLoggedIn();
    } else {
      return <Login errors={this.state.errors} logIn={this.logIn} />
    }
  }
}

export default App;
