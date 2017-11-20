import React, { Component } from 'react';
import axios from 'axios';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'Recharts';
import moment from 'moment';

class BussinessIntelligence extends Component {
  constructor(props) {
      super(props);

      this.getData = this.getData.bind(this);
      this.renderAwardCountTable = this.renderAwardCountTable.bind(this);
      this.renderAwardRecipientTable = this.renderAwardRecipientTable.bind(this);
      this.buildMonthGraphData = this.buildMonthGraphData.bind(this);
      this.buildWeekGraphData = this.buildWeekGraphData.bind(this);
      this.renderAwardWeekGraph = this.renderAwardWeekGraph.bind(this);
      this.renderAwardMonthGraph = this.renderAwardMonthGraph.bind(this);
      this.state = {};
  }

  componentWillMount() {
    Promise.all([
      this.getData('numberOfEachAwardType'),
      this.getData('nameOfRecipientPerAwardType'),
      this.getData('awardsReceivedPerUnitTime')
    ]);
  }

  getData(option) {
    axios.post('/query', { option })
      .then((response) => {
        if (response.data) {
          this.setState({ [`BI-${option}`]: response.data })
          return Promise.resolve();
        } else if (response.data.errors) {
          this.setState({
            errors: [ response.data.errors ]
          });
        }
      })
  }

  renderAwardCountTable() {
    const queryData = this.state['BI-numberOfEachAwardType'];
    let employeeOfMonth, employeeOfWeek, total;

    if(queryData) {
      employeeOfMonth = queryData.employeeOfMonth;
      employeeOfWeek = queryData.employeeOfWeek;
      total = employeeOfWeek + employeeOfMonth;
    }
    return (
      <div>
        <h5 className="center">Number of Awards</h5>
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
              <td className="center">{employeeOfWeek}</td>
            </tr>
            <tr className="row">
              <td>Employee of the Month</td>
              <td className="center">{employeeOfMonth}</td>
            </tr>
            <tr className="row bold-text">
              <td className="right">TOTAL</td>
              <td className="center">{total}</td>
            </tr>
        </tbody>
        </table>
      </div>
    );
  }

  renderAwardRecipientTable(awardType) {
    const queryData = this.state['BI-nameOfRecipientPerAwardType'];
    let awardRecipients = [];
    if(queryData) {
      awardRecipients = _.filter(queryData, recipient => recipient['awardType'] === awardType);
    }
    return (
      <div>
        <h5 className="center">{_.startCase(awardType)} Recipients</h5>
        <table className="table table-bordered">
          <thead className="thead-default">

            <tr className="row">
              <th className="center">Name</th>
              <th className="center">Count</th>
            </tr>
          </thead>
          <tbody>
            {_.map(awardRecipients, (recipient) => {
              return (
                <tr className="row" key={recipient.recipient}>
                  <td>{recipient.recipient}</td>
                  <td className="center">{recipient.count}</td>
                </tr>
              )})}
        </tbody>
      </table>
      </div>

    );
  }

  buildWeekGraphData() {
    const queryData = this.state['BI-awardsReceivedPerUnitTime'];
    const employeeOfMonth = _.filter(queryData, award =>
      award['awardType'] === 'employeeOfWeek');

    const sortedByMonth = _.countBy(employeeOfMonth, award =>
      moment(award.dateSent).format("wo"));

    return _.map(sortedByMonth, (count, week) => ({ week, count }));
  }

  renderAwardWeekGraph() {
    const data = this.buildWeekGraphData();
    return (
      <div>
        <h5 className="center">Employee of the Week Count vs Time</h5>
        <BarChart width={500} height={250} data={data}
        margin={{top: 5, right: 30, left: 20, bottom: 5}}>
          <XAxis dataKey="week"/>
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      </div>
    );
  }

  buildMonthGraphData() {
    const queryData = this.state['BI-awardsReceivedPerUnitTime'];
    const employeeOfMonth = _.filter(queryData, award =>
      award['awardType'] === 'employeeOfMonth');

    const sortedByMonth = _.countBy(employeeOfMonth, award =>
      moment(award.dateSent).format("MMM"));

    return _.map(sortedByMonth, (count, month) => ({ month, count }));
  }

  renderAwardMonthGraph() {
    const data = this.buildMonthGraphData();
    return (
      <div>
        <h5 className="center">Employee of the Month Count vs Time</h5>
        <BarChart width={500} height={250} data={data}
        margin={{top: 5, right: 30, left: 20, bottom: 5}}>
          <XAxis dataKey="month"/>
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-4">
            {this.renderAwardCountTable()}
          </div>
          <div className="col-md-4">
            {this.renderAwardRecipientTable('employeeOfWeek')}
          </div>
          <div className="col-md-4">
            {this.renderAwardRecipientTable('employeeOfMonth')}
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 center">
            {this.renderAwardWeekGraph()}
          </div>
          <div className="col-md-6 center">
            {this.renderAwardMonthGraph()}
          </div>
        </div>
      </div>
    );
  }
}

export default BussinessIntelligence;
