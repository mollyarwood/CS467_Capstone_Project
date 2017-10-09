import React, { Component } from 'react';

class ViewAwards extends Component {
  constructor(props) {
      super(props);
      // fetch user's recived awards from server
      this.state = {
        awardsRecieved: [
          {
            id: 1,
            name: 'Award1',
            date: '11/12/2016',
            givenBy: 'Person1'
          },
          {
            id: 2,
            name: 'Award2',
            date: '5/24/2015',
            givenBy: 'Person2'
          }
        ]
      }

      this.deleteAward = this.deleteAward.bind(this);
  }

  deleteAward(event) {
    const awardId = parseInt(event.target.id, 10);
    const newAwardsList = this.state.awardsRecieved
      .filter(award => award.id !== awardId);
    this.setState({
      awardsRecieved: newAwardsList
    });
  }

  render() {
    return (
      <div>
        <h4>Awards Recieved</h4>
        <table className="table">
          <thead>
            <tr className="row">
              <th className="col-md-4">Award</th>
              <th className="col-md-3">Date</th>
              <th className="col-md-5">Given by</th>

            </tr>
          </thead>
          <tbody>
            {this.state.awardsRecieved.map( award =>
              <tr className="row" key={award.id}>
                <td className="col-md-4">{award.name}</td>
                <td className="col-md-3">{award.date}</td>
                <td className="col-md-3">{award.givenBy}</td>
                <td className="col-md-2">
                  <button id={award.id} className="btn btn-danger" onClick={this.deleteAward}>
                    X
                  </button>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ViewAwards;
