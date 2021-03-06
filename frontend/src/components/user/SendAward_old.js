import React, { Component } from 'react';
import axios from 'axios';

class SendAward extends Component {
  constructor(props) {
    super(props);

    this.sendAward = this.sendAward.bind(this);
    this.renderErrors = this.renderErrors.bind(this);

    this.state = {
      errors: [],
      accounts: []
    }
  }

  componentWillMount() {
    axios.get(`/accounts?type=user`)
      .then((response) => {
        if (response.data.accounts) {
          this.setState({
            accounts: response.data.accounts,
            isLoading: false
          });
        }
      });
  }

  sendAward(event) {
    event.preventDefault();

      axios.post('/awards', {})
        .then((response) => {
          if (response.data.award) {
            this.props.changePage({ target: { name: 'ViewAwards' } });
          } else if (response.data.errors) {
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
        <div>
          <h4 className="text-center spacer-bottom">Send an Award</h4>
        </div>
        {this.renderErrors()}
          <form className="col-md-4 col-md-offset-4" onSubmit={this.sendAward}>
            <label htmlFor="awardType" className="col-form-label">Award Type:</label>
            <div className="form-check" name="awardType">
              <label className="form-check-label">
                <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="option1" />
                  Employee of the Week
              </label>
            </div>
            <div className="form-check">
              <label className="form-check-label">
                <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="option2" />
                  Employee of the Month
              </label>
            </div>

            <div className="form-group row">
              <label htmlFor="password" className="col-form-label">Recipient Name:</label>
              <div className="form-group">
                <select className="form-control" id="username">
                  {this.state.accounts.map((account) => <option key={account.id}>{account.username}</option>)}
                </select>
              </div>
            </div>
              <div className="form-group row">
                <label htmlFor="username" className="col-form-label">Recipient's Email Address: </label>
                <input className="form-control" type="text" name="username" />
              </div>
            <div className="row">
              <button className="btn btn-primary" type='submit'>Send</button>
              <button className="btn pull-right" type="button" name='ViewAwards' onClick={this.props.changePage}>Cancel</button>
            </div>
          </form>
      </div>
    );
  }
}

export default SendAward;
