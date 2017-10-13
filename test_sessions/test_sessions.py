# testing webapp2 sessions
import webapp2
import session_handler
import json
from google.appengine.ext.webapp import template

config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': 'my-super-secret-key',
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

class HomePage(session_handler.BaseHandler):
	def get(self):
		session = self.session.get('user')
		if session == None:
			self.redirect('/login')
		else:
			home_page_template = {
				'name': session
			}
			self.response.write(template.render('home.html', home_page_template))
			
	def post(self):
		logout = self.request.get('logout')
		
		if logout == 'Logout':
			self.redirect('/login')
			self.session.clear()
			
		
# [END main_page]



# [START app]
app = webapp2.WSGIApplication([
	('/login', LoginPage),
	('/home', HomePage)
], config=config, debug=True)
# [END app]