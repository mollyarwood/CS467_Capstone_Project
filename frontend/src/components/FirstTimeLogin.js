import React, { Component } from 'react';
import axios from 'axios';
import DropzoneComponent from 'react-dropzone-component';

var ReactDOMServer = require('react-dom/server');

var componentConfig = {
    iconFiletypes: ['.jpg', '.png', '.gif'],
    showFiletypeIcon: false,
    postUrl: 'no-url',

};

var djsConfig = {
  previewsContainer: document.querySelector('#sigPreview'),
  maxFiles: 1,
  autoProcessQueue: false,
  previewTemplate: ReactDOMServer.renderToStaticMarkup(
    <div className="">
      <div className="">
        <img data-dz-thumbnail="true" />
      </div>
    </div>
  )
}
var eventHandlers = { addedfile: (file) => console.log(file) }

class FirstTimeLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      preview: null
    };

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
    axios.patch(`/accounts`, { name, password })
      .then((response) => {
        this.props.onSubmit({userType: this.props.userType});
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
          <div className="signiture-upload form-group row">
            Upload an Image of Your Signature
            <DropzoneComponent
              config={componentConfig}
              eventHandlers={eventHandlers}
              djsConfig={djsConfig}
            ><div className="dz-message">Click or drag and drop file here</div></DropzoneComponent>
            <div id="sigPreview" className="dropzone-previews"></div>
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
