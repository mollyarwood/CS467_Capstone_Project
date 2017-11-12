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
import logging
from time import mktime
from webapp2_extras import sessions
from google.appengine.api import app_identity
from google.appengine.ext import ndb
from google.appengine.api import mail



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

	def get(self, account_type=None):
		logging.info(account_type)
		accounts = []
		for account in Account.query():
			account = account.to_dict()
			if account['account_type'] == account_type or account_type == None:
				accounts.append({
					"id": account['id'],
					"username": account['username'],
					"name": account['name'],
					"creation_date": account['creation_date'].strftime("%m/%d/%Y %H:%M:%S"),
					"last_modified": account['last_modified'].strftime("%m/%d/%Y %H:%M:%S")
				})
		return accounts



class AwardCollectionHandler(session_handler.BaseHandler):

	def get(self):
		awards = []
		query = Award.query()
		for award in query:
			award = award.to_dict()
			awards.append({
					"id": award['id'],
					"sender": award['sender'],
					"recipient_name": award['recipient_name'],
					"recipient_email": award['recipient_email'],
					"award_type": award['award_type'],
					"date_sent": award['date_sent'].strftime("%m/%d/%Y %H:%M:%S"),
				})
		return awards




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
			account_dict = dict()
			account_dict = {
				"errors": "Username already exists"
			}
		else:
			new_account = Account(username=account_data["username"],
			password=account_data["password"],
			account_type=account_data['userType'])

			if 'name' in account_data:
				new_account.name = account_data['name']

			new_account.put()
			new_account.id = new_account.key.urlsafe()
			new_account.put()
			account_dict = new_account.to_dict()
			account_dict = {
				"userDetails": account_dict
			}

		# self.response.write(json.dumps(account_dict, cls=MyEncoder))
		return json.dumps(account_dict, cls=MyEncoder)


	def patch(self, body=None):
		if body:
			account_data = body
		else:
			account_data = json.loads(self.request.body)

		account = Account.query(Account.id == account_data['id']).get()

		if account != None:
			if 'username' in account_data:
				account.username = account_data['username']
			if 'newPassword' in account_data:
				account.password = account_data['newPassword']
			if 'name' in account_data:
				account.name = account_data['name']
			if 'signature' in account_data:
				account.signature = account_data['signature']

			account.put()
			account_dict = account.to_dict()
			account_dict = {
			"userDetails": account_dict
			}

		else:
			account_dict = dict()
			account_dict = {
			"errors": "ERROR"
			}

		return json.dumps(account_dict, cls=MyEncoder)


	def get(self, id=None):
		if id:
			account = ndb.Key(urlsafe=id).get()
			if account != None:
				return json.dumps(account.to_dict())
				#self.response.write(json.dumps(account.to_dict()))
			else:
				return "Error: account ID not found"
				#self.response.write("account ID not found")



	def delete(self, id=None):
		if id:
			account = ndb.Key(urlsafe=id).get()
			if account != None:
				try:
					ndb.Key(urlsafe=id).delete()
					resp = {
					'deleted': 'True'
					}
				except datastore_errors.TransactionFailedError:
					resp = {
					'deleted': 'False'
					}
			else:
				resp = {
				'deleted': 'False'
				}
			self.response.write(json.dumps(resp))




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
				return json.dumps(award.to_dict(), cls=MyEncoder)
				#self.response.write(json.dumps(award.to_dict()))
			else:
				return "Error: award ID not found"
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

class RecoverHandler(session_handler.BaseHandler):

#	def get(self):
#		self.post()

	def post(self):

		email_data = json.loads(self.request.body)
		em = email_data['email']
		p = None

		query = Account.query()
		for account in query:
			account = account.to_dict()
			if em == account['username']:
				p = account['password']


		#Email Award to recipient
		sender_address = "arwoodm@oregonstate.edu"
		message = mail.EmailMessage(
			sender = sender_address,
			subject = "CS467 Password Recovery"
			)

		message.to = em

		if p != None:
			message.body = "Your password is {}".format(p)
		else:
			message.body = "Sorry, there is no user with that email in our account."
		message.send()
		resp = {
		'sent': 'True'
		}
		self.response.write(json.dumps(resp))



class QueryHandler(session_handler.BaseHandler):

	def post(self, option=None):
		option_data = json.loads(self.request.body)
		resp = None

		#Number of each award type given out
		if option_data["option"] == '1':
			count1 = 0
			query1 = Award.query(Award._properties["award_type"] == 'empOfMonth')
			results1 = list(query1.fetch())
			for award1 in results1:
				count1 += 1


			count2 = 0
			query2 = Award.query(Award._properties["award_type"] == 'empOfYear')
			results2 = list(query2.fetch())
			for award2 in  results2:
				count2 += 1

			resp =  {
				'empOfMonth' : count1,
				'empOfYear' : count2
			}


		#Name of people who have each received award type
		if option_data["option"] == '2':
			query = Award.query().fetch(projection=[Award.award_type,Award.recipient_name])

			resp = []
			for result in query:
				resp.append({'award type' : result.award_type, 'recipient' : result.recipient_name})


		self.response.write(json.dumps(resp))
