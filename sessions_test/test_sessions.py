# testing webapp2 sessions
import os
import webapp2
import binascii
import create_entities
import json
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
	#if the user exists and password is correct, the user will
	#be redirected to the home page, where he/she gets a session
	#token. else, they get an error message returned. 
	def post(self):
		username_entered = self.request.get('username')
		password_entered = self.request.get('password')

		for entity in create_entities.Account.query():
			if entity.username == username_entered:
				if entity.password == password_entered:
					#CREATE USER SESSION HERE SO REDIRECT TO CORRECT SPOT
					self.session['user'] = entity.username
					self.session['password'] = entity.password
					self.session['account_type'] = entity.account_type
					if entity.account_type == 'user':
						self.redirect('/userHome')
					elif entity.account_type == 'admin':
						self.redirect('/adminHome')
				else:
					self.response.out.write("The password or username entered is incorrect")





# [END main_page]

class UserHomePage(session_handler.BaseHandler):
	def get(self):

		#get username from db
		username = self.session.get('user')
		type = self.session.get('account_type')
		if username == None:
			self.redirect('/login')
		else:
			if type == 'user':
				self.response.write("home page")
				self.response.write("\n\n")
				self.response.write("welcome to the user home page \n")
				self.response.write(username)
				self.render_template('userHome.html')
			elif type == 'admin':
				self.redirect('/adminHome')
# [END main_page]


class AdminHomePage(session_handler.BaseHandler):
	def get(self):

		username = self.session.get('user')
		type = self.session.get('account_type')
		if username == None:
			self.redirect('/login')
		else:
			if type == 'admin':
				self.render_template('adminHome.html')
				self.response.write("home page")
				self.response.write("\n\n")
				self.response.write("welcome to the admin home page \n")
				self.response.write(username)
			elif type == 'user':
				self.redirect('/userHome')
				
	def post(self):
		req = self.request.get('logout')
		
		if req == 'Logout':
			self.redirect('/login')
			self.session.clear()
		
		req = self.request.get('accountManagement')
		if req == 'Account Management':
			self.redirect('/accountManagement')

class AccountManagementPage(session_handler.BaseHandler):
	def get(self):
		username = self.session.get('user')
		type = self.session.get('account_type')
		if username == None:
			self.redirect('/login')
		else:
			if type == 'admin':
				self.render_template('accountManagement.html')
				self.response.write("home page")
				self.response.write("\n\n")
				self.response.write("welcome to the admin home page \n")
				self.response.write(username)
			elif type == 'user':
				self.redirect('/userHome')

				
	def post(self):
		ah = create_entities.AccountHandler()
		body = dict()
		body['username'] = self.request.get('username')
		body['password'] = self.request.get('password')
		body['account_type'] = self.request.get('account_type')
		# self.response.write(body)
		create_entities.AccountHandler.post(ah, body)
		# username_entered = self.request.get('username')
		# password_entered = self.request.get('password')
		# boat_data = json.loads(self.request.body)
		
# [START app]
app = webapp2.WSGIApplication([
	('/login', LoginPage),
	('/userHome', UserHomePage),
	('/adminHome', AdminHomePage),
	('/account', create_entities.AccountHandler),
	('/account/(.*)', create_entities.AccountHandler),
	('/accounts', create_entities.AccountCollectionHandler),
	('/accountManagement', AccountManagementPage)
], config=config, debug=True)
# [END app]