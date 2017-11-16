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
		
		
		var e = event.target.signature
		var file = e.files[0]
		
		 console.log("File name: " + file.name)
		console.log("File size: " + file.size)
		console.log("Binary content: " + file.type)
		
		// var builder = new BlobBuilder()
		// builder.append("img", file)
		// var formdata = new FormData()
		// formdata.append("name", "signature")
		// formdata.append("img", file)
		
		var blob = new Blob([ file ], { type: "image/png" });
		
		// send via XHR 
		var xhr = new XMLHttpRequest()
		xhr.onload = function() {
			console.log("Upload complete.")
		};
		xhr.open("PATCH", "/accounts", true)
		xhr.send(blob);

		// var signature = new FormData()
		// var imagefile = document.querySelector('#signature')
		// signature.append("img", imagefile.files[0])
		
		// console.log(signature.get("img"))
		
		// console.log(event.target.signature.value)
		// var reader = new FileReader()
		// // var signature = new 
		// reader.readAsDataURL(event.target.signature.files[0])
	   // reader.onload = function () {
		   // // var signature = new Blob(reader.result, {type: "image/png"})
			// return reader.result
	   // };
	   // reader.onerror = function (error) {
		   // // var signature = error
			// return error
	   // };
		
			// var file = req.files.file;
			// var path = file.path;
			// var fsiz = file.size;
			// var buffer = new Buffer(fsiz);

			// fs.readFile(path, function (err, data) {
				// console.log(err);
				// console.log(data);
			// });
			
			// console.log(event.target.signature)
			
		  // console.log(signature)
		  // axios.patch('/accounts',
			// {
				// signature
			// },
			// {	
				// headers: {
					// 'Content-Type': 'multipart/form-data'
				// }
			// })
			// .then((response) => {
			  // if (response.data.userDetails) {
				// this.props.changePage({ target: { name: 'view' } });
			  // } else if (response.data.errors) {
				// this.setState({
				  // errors: [ response.data.errors ]
				// });
			  // }
			// })
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
                <button className="btn btn-primary" type='submit'>Update Name</button>
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
