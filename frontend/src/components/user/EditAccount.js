import React, { Component } from 'react';
import axios from 'axios';

class EditAccount extends Component {
  constructor(props) {
      super(props);

      this.renderErrors = this.renderErrors.bind(this);
      this.updateUsername = this.updateUsername.bind(this);
      this.updateName = this.updateName.bind(this);
      this.updatePassword = this.updatePassword.bind(this);
	  this.updateSignature = this.updateSignature.bind(this);

      this.state = {
        errors: []
      };
  }

  renderErrors() {
    if(this.state.errors.length !== 0) {
      return <div className="alert alert-danger col-md-6 col-md-offset-3"><ul>
        {this.state.errors.map(error => <li key={error}>{error}</li>)}
      </ul></div>
    }
    return <div></div>;
  }

  updateUsername(event) {
    event.preventDefault();
      const username = event.target.username.value;
      axios.patch('/accounts',
        {
          username,
        })
        .then((response) => {
          if (response.data.userDetails) {
            this.props.changePage({ target: { name: 'view' } });
          } else if (response.data.errors) {
            this.setState({
              errors: [ response.data.errors ]
            });
          }
        })
  }

  updateName(event) {
    event.preventDefault();
      const name = event.target.name.value;
      axios.patch('/accounts',
        {
          name,
        })
        .then((response) => {
          if (response.data.userDetails) {
            this.props.changePage({ target: { name: 'view' } });
          } else if (response.data.errors) {
            this.setState({
              errors: [ response.data.errors ]
            });
          }
        })
  }

  updatePassword(event) {
	  event.preventDefault();
      const newPassword = event.target.newPassword.value;
	  const confirmPassword = event.target.confirmPassword.value;
	  const currentPassword = event.target.currentPassword.value;
	  if (newPassword == confirmPassword) {
		  axios.patch('/accounts',
			{
			  currentPassword,
			  newPassword,
			})
			.then((response) => {
			  if (response.data.userDetails) {
				this.props.changePage({ target: { name: 'view' } });
			  } else if (response.data.errors) {
				this.setState({
				  errors: [ response.data.errors ]
				});
			  }
			})
	  } else {
		  this.setState({
			  errors: [ "Passwords do not match"]
		  })
	  }
  }
  
	updateSignature(event) {
		event.preventDefault();
		
		/**********************************************************
		** NOTES FROM ERIK
		**
		** TO BE IMPLEMENTED:
		**		- check that file size is less than 1 MB
		**		- check that file extention is jpeg/png/jpg
		**		  (possibly more, like GIF, TIFF, BMP, etc.)
		**		- test to see if above image formats convert easily
		**		  into jpeg
		**		- Catch errros - may need to change XMLHttpRequest
		**		  to a more React-friendly (see: axios) form
		***********************************************************
		*/
		
		var e = event.target.signature
		var file = e.files[0]
		
		console.log("File name: " + file.name)
		console.log("File size: " + file.size)
		console.log("Binary content: " + file.type)
		
		// Save image file as BLOB
		var blob = new Blob([ file ], { type: "image/jpeg" });
		
		// send via XHR 
		var xhr = new XMLHttpRequest()
		xhr.onload = function() {
			console.log("Upload complete.")
		};
		xhr.open("PATCH", "/accounts", true)
		xhr.send(blob);

		
    }

 
  render() {
    return (
      <div>
        <div>
          <h3 className="text-center spacer-bottom">Edit Account</h3>
        </div>
        <div>
          {this.renderErrors()}
          <div className="col-md-3 col-md-offset-2">
            <form onSubmit={this.updateUsername}>
              <div className="form-group row">
                <label htmlFor="username" className="col-form-label">Username</label>
                <input className="form-control" type="text" name="username" />
              </div>
              <div className="row">
                <button className="btn btn-primary spacer-bottom" type='submit'>Update Username</button>
              </div>
            </form>
            <form onSubmit={this.updateName}>
              <div className="form-group row">
                <label htmlFor="name" className="col-form-label">Name</label>
                <input className="form-control" type="text" id="name" name="name" />
              </div>
              <div className="row">
                <button className="btn btn-primary spacer-bottom" type='submit'>Update Name</button>
              </div>
            </form>
			<form onSubmit={this.updateSignature} encType="multipart/form-data" type="files">
				<div className="form-group row">
					<label htmlFor="signature" className="col-form-label">Signature</label>
					<input className="form-control" type="file" id="signature" name="signature" />
				</div>
				<div className="row">
					<button className="btn btn-primary spacer-bottom" type='submit'>Update Signature</button>
				</div>
			</form>
          </div>
          <div className="col-md-3 col-md-offset-2">
            <form onSubmit={this.updatePassword}>
              <div className="form-group row">
                <label htmlFor="currentPassword" className="col-form-label"> Current Password</label>
                <input className="form-control" type="password" id="currentPassword" name="currentPassword" />
              </div>
              <div className="form-group row">
                <label htmlFor="newPassword" className="col-form-label"> New Password</label>
                <input className="form-control" type="password" id="newPassword" name="newPassword" />
              </div>
              <div className="form-group row">
                <label htmlFor="confirmPassword" className="col-form-label">Confirm Password</label>
                <input className="form-control" type="password" id="confirmPassword" name="confirmPassword" />
              </div>
              <div className="row">
                <button className="btn btn-primary" type='submit'>Update Password</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default EditAccount;
