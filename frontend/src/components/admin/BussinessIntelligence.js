import React, { Component } from 'react';
import axios from 'axios';

class BussinessIntelligence extends Component {
  constructor(props) {
      super(props);

      this.getData = this.getData.bind(this);
      this.renderAwardCountTable = this.renderAwardCountTable.bind(this);
      this.renderAwardRecipientTable = this.renderAwardRecipientTable.bind(this);
      this.state = {};
  }

  componentDidMount() {
    Promise.all([
      this.getData('1'),
      this.getData('2')
    ]);
  }

  getData(option) {
    axios.post('/query', { option })
      .then((response) => {
        if (response.data) {
          this.setState({ [`BI-Option${option}`]: response.data })
          return Promise.resolve();
        } else if (response.data.errors) {
          this.setState({
            errors: [ response.data.errors ]
          });
        }
      })
  }

  renderAwardCountTable() {
    const option1Data = this.state['BI-Option1'];
    let empOfMonth;
    let empOfYear;

    if(option1Data) {
      empOfMonth = option1Data.empOfMonth;
      empOfYear = option1Data.empOfYear;
    }
    return (
      <table className="table table-bordered">
        <thead className="thead-default">
          <tr className="row">
            <th>Award Type</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          <tr className="row">
            <td>Employee of the Week</td>
            <td className="center">{}</td>
          </tr>
          <tr className="row">
            <td>Employee of the Month</td>
            <td className="center">{empOfMonth}</td>
          </tr>
      </tbody>
      </table>
    );
  }

  renderAwardRecipientTable(awardType) {
    const option2Data = this.state['BI-Option2'];
    let awardRecipients = [];
    if(option2Data) {
      awardRecipients = _.filter(option2Data, recipient => recipient['award type'] === awardType);
    }
    return (
      <table className="table table-bordered">
        <thead className="thead-default">
          <tr className="row">
            <th className="center">{_.startCase(awardType)} Recipients</th>
          </tr>
        </thead>
        <tbody>
          {_.map(awardRecipients, (recipient) => {
            return (
              <tr className="row" key={recipient.recipient}>
                <td>{recipient.recipient}</td>
              </tr>
            )})}
      </tbody>
    </table>
    );
  }

  render() {
    return (
      <div>
        <div className="col-md-3">
          {this.renderAwardCountTable()}
        </div>
        <div className="col-md-3">
          {this.renderAwardRecipientTable('employee_of_the_week')}
        </div>
        <div className="col-md-3">
          {this.renderAwardRecipientTable('employee_of_the_month')}
        </div>

      </div>
    );
  }
}

export default BussinessIntelligence;
