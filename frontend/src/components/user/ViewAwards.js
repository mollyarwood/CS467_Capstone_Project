import React, { Component } from 'react';
import axios from 'axios';

class ViewAwards extends Component {
  constructor(props) {
      super(props);
      this.state = {
        awardsRecieved: []
      }

      this.renderAwards = this.renderAwards.bind(this);
      this.deleteAward = this.deleteAward.bind(this);
  }

  componentWillMount() {
    axios.get(`/api/awards?name=${this.props.name}`).then((response) => {
      if (response.data.awards) {
        this.setState({
          awardsRecieved: response.data.awards
        });
      }
    });
  }

  deleteAward(event) {
    const awardId = parseInt(event.target.id, 10);

    axios.delete('/ROUTE-HERE').then((response) => {
      const newAwardsList = this.state.awardsRecieved
        .filter(award => award.id !== awardId);
      this.setState({
        awardsRecieved: newAwardsList
      });
    });
  }

  renderAwards() {
    if (this.state.awardsRecieved.length > 0) {
      return (this.state.awardsRecieved.map( award =>
        <tr className="row" key={award.id}>
          <td className="col-md-4">{award.name}</td>
          <td className="col-md-3">{award.date}</td>
          <td className="col-md-4">{award.givenBy}</td>
          <td className="col-md-1">
            <button id={award.id} className="btn btn-danger" onClick={this.deleteAward}>
              DELETE
            </button>
          </td>
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
              <th className="col-md-3">Date</th>
              <th className="col-md-4">Given by</th>
              <th className="col-md-1">Actions</th>

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
