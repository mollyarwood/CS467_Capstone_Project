import webapp2
import session_handler
import json
import yaml

config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': 'my-super-secret-key',
}

class AuthHandler(session_handler.BaseHandler):
    # Checks if user is already logged in
    def get(self):
        session = self.session.get('user')
        if session == None:
            self.response.write(json.dumps({
                "LoggedIn": False
            }))
        else:
            self.response.write(json.dumps({
                "loggedIn": True,
                "userType": self.session.get('userType')
            }))

    # login handler
    def post(self):
        post_data = yaml.safe_load(self.request.body)
        username = str(post_data['username'])
        password = str(post_data['password'])

        # A real check to database for user goes here, this is placeholder
        if username == "admin" and password == "pass":
            userType = 'admin'
        # End of place holder

            self.session['user'] = username
            self.session['userType'] = userType

            self.response.write(json.dumps({
                "loggedIn": True,
                "userType": userType
            }))
        else:
            self.response.write(json.dumps({
                "errors": "invalid login"
            }))

class LogoutHandler(session_handler.BaseHandler):
    def get(self):
        self.session.clear()


# [START app]
app = webapp2.WSGIApplication([
	('/auth', AuthHandler),
    ('/logout', LogoutHandler)
], config=config, debug=True)
# [END app]
