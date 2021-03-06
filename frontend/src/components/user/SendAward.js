import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';

class SendAward extends Component {
  constructor(props) {
    super(props);

	this.validateForm = this.validateForm.bind(this);
    this.sendAward = this.sendAward.bind(this);
    this.renderErrors = this.renderErrors.bind(this);
    this.changeSelectedUser = this.changeSelectedUser.bind(this);

    this.state = {
      errors: [],
      accounts: [],
      selectedUserEmail: null
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
  
   validateForm(event) {
    event.preventDefault();
    event.preventDefault();
    const selectedId = event.target.username.options[event.target.username.selectedIndex].id;
    const recipient_email = event.target.recipient_email.value;
	const award_type = event.target.awardType.value;
    const errors = [];

    if (!selectedId) {
      errors.push('Must select a user.');
    }
    if (!award_type) {
      errors.push('Must select an award type.');
    }
    if (!recipient_email) {
      errors.push('Recipient email cannot be blank.');
    }

    this.setState({
      errors
    });

    if(errors.length === 0) {
      this.sendAward(event);
    }
  }

  sendAward(event) {
    event.preventDefault();
    const selectedId = event.target.username.options[event.target.username.selectedIndex].id;
    const account = _.find(this.state.accounts, account => account.id === selectedId);
    const recipient_username = account.username;
    const recipient_email = event.target.recipient_email.value;
	  const award_type = event.target.awardType.value;
      axios.post('/sendAward',
        {
          recipient_username,
          recipient_email,
		  award_type
        }).then((response) => {
          if (response.data.award) {
            this.props.changePage({ target: { name: 'ViewAwards' } });
          } else if (response.data.errors) {
            this.setState({
              errors: [ response.data.errors ]
            });
          }
        })
  }

  changeSelectedUser(event) {
    const selectedId = event.target.options[ event.target.selectedIndex ].id;
    const account = _.find(this.state.accounts, account => account.id === selectedId);
    const selectedUserEmail = account ? account.username : "";

    this.setState({ selectedUserEmail });
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
          <form className="col-md-4 col-md-offset-4" onSubmit={this.validateForm}>
            <label htmlFor="awardType" className="col-form-label">Award Type:</label>
            <div className="form-check" name="awardType">
              <label className="form-check-label">
                <input className="form-check-input" type="radio" name="awardType" id="exampleRadios1" value="employeeOfWeek" />
                  Employee of the Week
              </label>
            </div>
            <div className="form-check">
              <label className="form-check-label">
                <input className="form-check-input" type="radio" name="awardType" id="exampleRadios2" value="employeeOfMonth" />
                  Employee of the Month
              </label>
            </div>

            <div className="form-group row">
              <label htmlFor="password" className="col-form-label">Recipient Name:</label>
              <div className="form-group">
                <select
                  className="form-control"
                  id="username"
                  name="username"
                  onChange={this.changeSelectedUser}
                  defaultValue=""
                >
                  <option></option>
                  {this.state.accounts
                    .filter(account => account.name)
                    .map((account) => <option id={account.id} key={account.id}>{account.name}</option>)
                  }
                </select>
              </div>
            </div>
              <div className="form-group row">
                <label htmlFor="recipient_email" className="col-form-label">Recipient's Email Address: </label>
                <input
                  className="form-control"
                  type="text"
                  key={this.state.selectedUserEmail}
                  defaultValue={this.state.selectedUserEmail}
                  name="recipient_email"
                />
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
