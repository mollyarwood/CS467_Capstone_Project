# testing webapp2 sessions
import webapp2
import session_handler
import json
import create_entities
import os
import binascii
from google.appengine.ext.webapp import template

config = {}
key = binascii.hexlify(os.urandom(24))
config['webapp2_extras.sessions'] = {
    'secret_key': key,
}


# [START main_page]
class LoginPage(session_handler.BaseHandler):
	def get(self):
		self.response.write(template.render('login.html', {}))
		
	def post(self):
		username = self.request.get('username')	
		password = self.request.get('password')
		# login_data = json.loads(self.request.body)
		if username == "admin" and password == "password":
			self.session['user'] = "admin"
			self.redirect('/home')
		else:
			invalid_creds_template = {
				'message': 'Your username and/or password is invalid. Please try again or contact an administrator.'
			}
			self.response.write(template.render('login.html', invalid_creds_template))
	
# [END main_page]

class UserHomePage(session_handler.BaseHandler):
	def get(self):
		session = self.session.get('account')
		if session == None:
			self.redirect('/login')
		else:
			home_page_template = {
				'name': session
			}
			self.response.write(template.render('user_home.html', home_page_template))
			
	def post(self):
		logout = self.request.get('logout')
		
		if logout == 'Logout':
			self.redirect('/login')
			self.session.clear()
			
class AdminHomePage(session_handler.BaseHandler):
	def get(self):
		session = self.session.get('account')
# [END main_page]


			
class SecretTestPage(create_entities.AccountHandler):
	def post(self):
		self.post()


# [START app]
app = webapp2.WSGIApplication([
	('/login', LoginPage),
	('/user_home', UserHomePage),
	('/admin_home', AdminHomePage),
	('/account', SecretTestPage)
], config=config, debug=True)
# [END app]