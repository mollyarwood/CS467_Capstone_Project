# testing webapp2 sessions
import webapp2
import session_handler

config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': 'my-super-secret-key',
}


# [START main_page]
class LoginPage(webapp2.RequestHandler):
	def get(self):
		self.response.write('login page')
# [END main_page]

class HomePage(session_handler.BaseHandler):
	def get(self):
		self.session['user'] = "test"
		session = self.session.get('user')
		if session == None:
			self.redirect('/login')
		else:
			self.response.write("home page")
			self.response.write("\n\n")
			self.response.write("the user session key is: " + str(session))
# [END main_page]



# [START app]
app = webapp2.WSGIApplication([
	('/login', LoginPage),
	('/home', HomePage)
], config=config, debug=True)
# [END app]