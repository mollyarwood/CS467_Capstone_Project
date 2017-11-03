import React, { Component } from 'react';
import axios from 'axios';
import Login from './Login';
import Notifications, {notify} from 'react-notify-toast';

class Recover extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 'recover',
      errors: []
    };


    this.renderErrors = this.renderErrors.bind(this);
    this.sendPass = this.sendPass.bind(this);

  }


  sendPass(event) {
    event.preventDefault();
    const email = event.target.email.value;

    axios.post('/recover', {email})
    .then((response) => {
        if (response.data.sent) {
            let myColor = {background: '#0E1717', text: "#FFFFFF"};
            notify.show('Email Has Been Sent', "success", 2000, myColor);
            setTimeout(() => {this.props.changePage({ target: { name: 'login' } })}, 3000);
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
    return (
      <div>
        <Notifications />
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
  }

}

export default Recover;