import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

class ViewAwards extends Component {
  constructor(props) {
      super(props);
      this.state = {
        awardsRecieved: []
      }

      this.renderAwards = this.renderAwards.bind(this);
  }

  componentWillMount() {
    axios.get(`/api/awards`).then((response) => {
      if (response.data) {
        const usersRecievedAwards = _.filter(response.data, award =>
          award.recipient_email === this.props.username);
        this.setState({
          awardsRecieved: usersRecievedAwards
        });
      }
    });
  }

  renderAwards() {
    if (this.state.awardsRecieved.length > 0) {
      return (this.state.awardsRecieved.map(award =>
        <tr className="row" key={award.id}>
          <td className="col-md-4">{_.startCase(award.award_type)}</td>
          <td className="col-md-4">{moment(award.date_sent).format('MM/DD/YYYY')}</td>
          <td className="col-md-4">{award.sender}</td>
        </tr>))
    } else {
      return (
        <tr>
          <td style={{textAlign: 'center', fontSize: '20px', paddingTop: '50px'}}>No Awards Recieved</td>
        </tr>
      )
    }

  }

  render() {
    return (
      <div>
        <h4 className="spacer-bottom">Awards Recieved</h4>
        <table className="table">
          <thead>
            <tr className="row">
              <th className="col-md-4">Award</th>
              <th className="col-md-4">Date Sent</th>
              <th className="col-md-4">Given By</th>

            </tr>
          </thead>
          <tbody>
            {this.renderAwards()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ViewAwards;
