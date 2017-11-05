import React, { Component } from 'react';
import axios from 'axios';
import Dropzone from 'react-dropzone';

class FirstTimeLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: []
    };

    this.uploadSigniture = this.uploadSigniture.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.renderErrors = this.renderErrors.bind(this);
  }

  validateForm(event) {
    event.preventDefault();
    const newPassword = event.target.newPassword.value;
    const confirmPassword = event.target.confirmPassword.value;
    const name = event.target.name.value;
    const errors = [];

    if (!newPassword) {
      errors.push('New password cannot be blank');
    }
    if (!confirmPassword) {
      errors.push('Confirm password cannot be blank');
    }
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      errors.push('Passwords don\'t match');
    }
    if (!name) {
      errors.push('Name cannot be blank')
    }

    this.setState({
      errors
    });

    if(errors.length === 0) {
      this.submit(event);
    }
  }

  submit(event) {
    const name = event.target.name.value;
    const password = event.target.newPassword.value;
    const signiture = "";
    axios.patch(`/api/account/${this.props.accountId}`, { name, password })
      .then((response) => {
        this.props.onSubmit({userType: this.props.userType});
      })
  }

  uploadSigniture(event) {
      alert('upload signiture here');
      event.preventDefault();
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
          <h3 id="welcome" className="text-center">Provide Account Information</h3>
        </div>
        {this.renderErrors()}
        <form className="col-md-4 col-md-offset-4" onSubmit={this.validateForm}>
          <div className="form-group row">
            <label htmlFor="newPassword" className="col-form-label"> New Password</label>
            <input className="form-control" type="password" id="newPassword" name="newPassword" />
          </div>
          <div className="form-group row">
            <label htmlFor="confirmPassword" className="col-form-label">Confirm Password</label>
            <input className="form-control" type="password" id="confirmPassword" name="confirmPassword" />
          </div>
          <div className="form-group row">
            <label htmlFor="nameame" className="col-form-label">Preferred Name</label>
            <input className="form-control" type="text" id="name" name="name" />
          </div>
          <div className="row">
            <Dropzone
                  multiple={false}
                  accept="image/*"
                  onDrop={this.uploadSigniture}>
                  <p>Drop an image or click to select a file to upload.</p>
            </Dropzone>
              <div>Upload an Image of Your Signature</div>
            <button className="btn center-block" onClick={this.uploadSigniture}>Upload</button>
          </div>
          <div className="row spacer">
            <button className="btn btn-primary center-block" type='submit'>Submit</button>
          </div>
        </form>
      </div>


    );
  }
}

export default FirstTimeLogin;
