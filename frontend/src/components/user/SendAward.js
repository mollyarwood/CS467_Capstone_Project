import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';

class SendAward extends Component {
  constructor(props) {
    super(props);

    this.sendAward = this.sendAward.bind(this);
    this.renderErrors = this.renderErrors.bind(this);

    this.state = {
      errors: []
    }
  }

  sendAward(event) {
    event.preventDefault();
     // const user_name = 'test user name';
      const recipient_name = event.target.recipient_name.value;
      const recipient_email = event.target.recipient_email.value;
	 const award_type = event.target.award_type.value;
      axios.post('/sendAward',
        {
          recipient_name,
          recipient_email,
		award_type
        })
     //    .then((response) => {
     //      if (response.data.userDetails) {
     //        this.props.changePage({ target: { name: 'view' } });
     //      } else if (response.data.errors) {
     //        this.setState({
     //          errors: [ response.data.errors ]
     //        });
     //      }
     //    })
  }

  renderErrors() {
    // if(this.state.errors.length !== 0) {
    //   return <div className="alert alert-danger col-md-6 col-md-offset-3"><ul>
    //     {this.state.errors.map(error => <li key={error}>{error}</li>)}
    //   </ul></div>
    // }
    return <div></div>;
  }

  render() {
    return (
      <div>
        <div>
          <h4 className="text-center spacer-bottom">Send Award (dev)</h4>
        </div>
        {this.renderErrors()}
          <form className="col-md-4 col-md-offset-4" onSubmit={this.sendAward}>
            <div className="form-group row">
              <label htmlFor="recipient_name" className="col-form-label">Recipient Name:</label>
              <input className="form-control" type="text" name="recipient_name" />
            </div>
            <div className="form-group row">
              <label htmlFor="recipient_email" className="col-form-label">Recipient Email:</label>
              <input className="form-control" type="email" name="recipient_email" />
            </div>
		  <div className="form-group row">
              <label htmlFor="award_type" className="col-form-label">Award Type:</label>

              <input className="form-control" type="radio" name="award_type" id="best_employee" value="best_employee"/>
		    <label htmlFor="best_employee">Best Employee</label>
		    <input className="form-control" type="radio" name="award_type" id="worst_employee" value="worst_employee"/>
		    <label htmlFor="worst_employee">Worst Employee</label>
            </div>
            <div className="row">
              <button className="btn btn-primary" type='submit'>Send Award</button>
            </div>
          </form>
      </div>
    );
  }
}

export default SendAward;
