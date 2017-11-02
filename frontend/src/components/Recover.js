import React, { Component } from 'react';
import axios from 'axios';
import Login from 'Login';

class Recover extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 'recover',
      errors: []
    };


    this.renderErrors = this.renderErrors.bind(this);
    this.sendPass = this.sendPass.bind(this);
    this.changePage = this.changePage.bind(this);

  }

  changePage(event) {
    const newPage = event.target.name;
    this.setState({
      currentPage: newPage
    });
  }



  sendPass(event) {
    event.preventDefault();
    const email = event.target.email.value;

    axios.post('/recover', {email})
    .then((response) => {
        if (response.data.sent) {
            console.log(response.data.sent);
            this.setState({currentPage: 'login'});
        } else {
          this.setState({
            errors: [ response.data.errors ]
          });
        }
      })
  }



  renderErrors() {
    if(this.state.errors.length !== 0) {
      return <div className="alert alert-danger col-md-6 col-md-offset-3"><ul>
        {this.state.errors.map(error => <li key={error}>{error}</li>)}
      </ul></div>
    }
    return <div></div>;
  }



  render() {
    if (this.state.currentPage === 'recover') {
      return (
        <div>
          <div>
            <h2 id="welcome" className="text-center">Password Recovery</h2>
          </div>
          {this.renderErrors()}
          <form className="col-md-4 col-md-offset-4" onSubmit={this.sendPass}>
            <div className="form-group row">
              <label htmlFor="email" className="col-form-label">Email</label>
              <input className="form-control" type="text" name="email" />
            </div>
            <div className="row">
              <button className="btn btn-primary" type='submit'>Send Password to Email</button>
            </div>
          </form>
        </div>
      );
    } else if (this.state.currentPage === 'login') {
      return <Login />;
    }
  }

}

export default Recover;