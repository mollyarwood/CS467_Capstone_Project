# testing webapp2 sessions
import os
import webapp2
import binascii
import create_entities
from webapp2_extras import jinja2
import session_handler
from google.appengine.ext import ndb



#generate rando for secret_key
key = binascii.hexlify(os.urandom(24))

config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': key,
}


# [START main_page]
class LoginPage(session_handler.BaseHandler):

	def get(self):
		self.render_template('login.html')

	#post will send the username and password to the datastore
	#if the user exists and password is correct, a session is 
	#created and user directed to home page based on their 
	#account type. else, error message.
	def post(self):
		username_entered = self.request.get('username')
		password_entered = self.request.get('password')

		for entity in create_entities.Account.query():
			if entity.username == username_entered:
				if entity.password == password_entered:
					#CREATE SESSION HERE SO REDIRECT TO CORRECT SPOT
					self.redirect('/home')
				else:
					self.response.out.write("The password or username entered is incorrect")





# [END main_page]

class HomePage(session_handler.BaseHandler):
	def get(self):

		#set this to username?
		self.session['user'] = "test"
		session = self.session.get('user')
		if session == None:
			self.redirect('/login')
		else:
			self.response.write("home page")
			self.response.write("\n\n")
			self.response.write("welcome to the home page\n")
# [END main_page]



# [START app]
app = webapp2.WSGIApplication([
	('/login', LoginPage),
	('/home', HomePage),
	('/account', create_entities.AccountHandler)
], config=config, debug=True)
# [END app]
