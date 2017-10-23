# These are the two entities to be used in the Employee Award
# system. I was unsure to include region or not, and as to how to 
# record that. GAE has a geographical point datatype, which contains
# the latitude/longitude point. We would probably have to request the
# user permission to access their current location.
import os
import webapp2
import json
import session_handler
import datetime
from time import mktime
from webapp2_extras import sessions
from google.appengine.api import app_identity
from google.appengine.ext import ndb



class Account(ndb.Model):
	id = ndb.StringProperty()
	username = ndb.StringProperty(required=True)
	password = ndb.StringProperty(required=True)
	name = ndb.StringProperty()
	account_type = ndb.StringProperty(required=True)
	creation_date = ndb.DateTimeProperty(auto_now_add=True )
	last_modified = ndb.DateTimeProperty(auto_now=True)
	signature = ndb.BlobProperty()

	
class Award(ndb.Model):
	id = ndb.StringProperty()
	sender = ndb.StringProperty(required=True)
	recipient_email = ndb.StringProperty(required=True)
	recipient_name = ndb.StringProperty()
	award_type = ndb.StringProperty()
	date_sent = ndb.DateTimeProperty(auto_now_add=True)
	# region = ndb.GeoPtProperty()


#extending the json class to handle datetime
class MyEncoder(json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return int(mktime(obj.timetuple()))

        return json.JSONEncoder.default(self, obj)


class AccountCollectionHandler(session_handler.BaseHandler):
	
	def get(self):
		query = Account.query()
		for account in query:
			account = account.to_dict()
			self.response.write(json.dumps(account, cls=MyEncoder))
			self.response.write('\n')
			
			
			
class AwardCollectionHandler(session_handler.BaseHandler):
	
	def get(self):
		query = Award.query()
		for award in query:
			award = award.to_dict()
			self.response.write(json.dumps(award, cls=MyEncoder))
			self.response.write('\n')
			
			
			
# This is the AccountHandler. It handles the post, patch, get
# and delete functions. It returns the JSON of the entity upon 
# success, or an error message if the ID is not found.
class AccountHandler(session_handler.BaseHandler):

	def post(self, body=None):
	
		if body:
			account_data = body
		else:
			account_data = json.loads(self.request.body)
			
		username_already_exists = Account.query(Account.username == account_data['username']).get()
		
		# USERNAMES MUST BE UNIQUE ACROSS ACCOUNTS
		if username_already_exists:
			return False
		else:
			new_account = Account(username=account_data["username"],
			password=account_data["password"],
			account_type=account_data['account_type'])
			
			if 'name' in account_data:
				new_account.name = account_data['name']

			new_account.put()
			new_account.id = new_account.key.urlsafe()
			new_account.put()
			account_dict = new_account.to_dict()
			
			# self.response.write(json.dumps(account_dict, cls=MyEncoder))
			return True
		#return json.dumps(account_dict, cls=MyEncoder)
	


	def patch(self, id=None):
		if id:
			account_data = json.loads(self.request.body)
			account = ndb.Key(urlsafe=id).get()
			
			if account != None:
				if 'username' in account_data:
					account.username = account_data['username']
				if 'password' in account_data:
					account.password = account_data['password']
				if 'name' in account_data:
					account.name = account_data['name']
				if 'account_type' in account_data:
					account.account_type = account_data['account_type']
				if 'signature' in account_data:
					account.signature = account_data['signature']
								
				account.put()
				return json.dumps(account.to_dict(), cls=MyEncoder)
				# self.response.write(json.dumps(account.to_dict()))
			else:
				return "Error: accound ID not found"
				# self.response.write("account ID not found")
				

			
	def get(self, id=None):
		if id:
			account = ndb.Key(urlsafe=id).get() 
			if account != None:
				return json.dumps(account.to_dict())
				#self.response.write(json.dumps(account.to_dict()))
			else:
				return "Error: accound ID not found"
				#self.response.write("account ID not found")
	


	def delete(self, id=None):
		if id:
			account = ndb.Key(urlsafe=id).get()
			if account != None:
				ndb.Key(urlsafe=id).delete()
				return "account deleted"
				# self.response.write('account deleted')
			else:
				return "Error: account ID not found"
				# self.response.write("account ID not found")
				



# This is the AwardHandler. It handles the post, get
# and delete functions. It returns the JSON of the entity upon 
# success, or an error message if the ID is not found.
class AwardHandler(session_handler.BaseHandler):

	def post(self, body):
		
		if body:
			award_data = body
		else:
			award_data = json.loads(self.request.body)
		
		new_award = Award( \
		sender=award_data["sender"], \
		recipient_name=award_data["recipient_name"], \
		recipient_email=award_data["recipient_email"], \
		award_type=award_data["award_type"]) 

		new_award.put()
		new_award.id = new_award.key.urlsafe()
		new_award.put()
		
		# self.response.write(json.dumps(award.to_dict()))
		return True
	
	# User should not be able to edit an award once its sent.
	
	# def patch(self, id=None):
		# if id:
			# award_data = json.loads(self.request.body)
			# award = ndb.Key(urlsafe=id).get()
			
			# if award != None:
				# award.put()
				# return json.dumps(award.to_dict())
				# # self.response.write(json.dumps(award.to_dict()))
			# else:
				# return "Error: accound ID not found"
				# # self.response.write("award ID not found")
				
			
	def get(self, id=None):
		if id:
			award = ndb.Key(urlsafe=id).get() 
			if award != None:
				return json.dumps(award.to_dict())
				#self.response.write(json.dumps(award.to_dict()))
			else:
				return "Error: accound ID not found"
				#self.response.write("award ID not found")
	


	def delete(self, id=None):
		if id:
			award = ndb.Key(urlsafe=id).get()
			if award != None:
				ndb.Key(urlsafe=id).delete()
				return "award deleted"
				# self.response.write('award deleted')
			else:
				return "Error: award ID not found"
				# self.response.write("award ID not found")