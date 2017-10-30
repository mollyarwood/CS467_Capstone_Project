import os
import webapp2
import session_handler
import create_entities
import json
import yaml
import binascii
import logging
import datetime
import urllib
from time import mktime
from google.appengine.api import mail

#generate random string for the session
key = binascii.hexlify(os.urandom(24))

config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': key,
}


#extending the json class to handle datetime
class MyEncoder(json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return int(mktime(obj.timetuple()))

        return json.JSONEncoder.default(self, obj)

class AuthHandler(session_handler.BaseHandler):
    # Checks if user is already logged in
    def get(self):
        ah = create_entities.AccountHandler()
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
        # logging.info(self.request.body)
        username_entered = str(post_data['username'])
        password_entered = str(post_data['password'])
        userFound = False

        for entity in create_entities.Account.query():
            # logging.info(entity)
            if entity.username == username_entered:
                if entity.password == password_entered:
                    # logging.info(entity.account_type)
                    self.session['user'] = entity.username
                    self.session['userType'] = entity.account_type
                    userFound = True

        if userFound:
            self.response.write(json.dumps({
                "loggedIn": True,
                "userType": self.session['userType']
            }))
        else:
            self.response.write(json.dumps({
               "errors": "invalid login"
            }))


class LogoutHandler(session_handler.BaseHandler):
    def get(self):
        self.session.clear()


class AccountHandler(session_handler.BaseHandler):
    def get(self):
        account_type = self.request.GET['type']
        ah = create_entities.AccountCollectionHandler()
        accounts = create_entities.AccountCollectionHandler.get(ah, account_type)
        logging.info(accounts)
        self.response.write(json.dumps({ "accounts": accounts }))

    def post(self):
        ah = create_entities.AccountHandler()
        response = create_entities.AccountHandler.post(ah, yaml.safe_load(self.request.body))
        self.response.write(response)


class SendAwardHandler(session_handler.BaseHandler):
    def get(self):
        self.response.write("SendAwardHandler GET Called")
    
    def post(self):
        # SAVE AWARD IN DB
        ah = create_entities.AwardHandler()
        body = yaml.safe_load(self.request.body)
        body["sender"] = self.session.get("user")
        response = create_entities.AwardHandler.post(ah, body)
        self.response.write(response)

        # SEND EMAIL
        sender = body["sender"]
        recipient_email=body["recipient_email"]
        # self.response.write("award sent")
        mail.send_mail(sender=sender,
        to=recipient_email,
        subject="Congratulations " + body["recipient_name"] + "! You received an award!",
        body="See attachment.")
        

class ApiAwardHandler(webapp2.RequestHandler):
    def post(self):
        ah = create_entities.AwardHandler()
        response = create_entities.AwardHandler.post(ah, self.request.body)
        self.response.write(response)

    def get(self, id=None):
        ah = create_entities.AwardHandler()
        response = create_entities.AwardHandler.get(ah, id)
        self.response.write(response)

    def delete(self, id=None):
        ah = create_entities.AwardHandler()
        response = create_entities.AwardHandler.delete(ah, id)
        self.response.write(response)
    

class ApiAwardCollectionHandler(webapp2.RequestHandler):
    def get(self):
        ah = create_entities.AwardCollectionHandler()
        response = create_entities.AwardCollectionHandler.get(ah)
        self.response.write(response)


        
class ApiAccountHandler(session_handler.BaseHandler):
    def post(self):
        ah = create_entities.AccountHandler()
        response = create_entities.AccountHandler.post(ah, self.request.body)
        self.response.write(response)
     
    def get(self, id=None):
        ah = create_entities.AccountHandler()
        response = create_entities.AccountHandler.get(ah, id)
        self.response.write(response)

    def delete(self, id=None):
        ah = create_entities.AccountHandler()
        response = create_entities.AccountHandler.delete(ah, id)
        self.response.write(response)
        
        
class ApiAccountCollectionHandler(session_handler.BaseHandler):
    def get(self):
        ah = create_entities.AccountCollectionHandler()
        response = create_entities.AccountCollectionHandler.get(ah)
        self.response.write(response)

    

class PassHandler(session_handler.BaseHandler):
    def get(self):
        self.response.write("PassHandler GET Called")
        
    def post(self):
        ah = create_entities.RecoverHandler()
        response = create_entities.RecoverHandler.post(ah, yaml.safe_load(self.request.body))
        self.response.write(response)


# [START app]
app = webapp2.WSGIApplication([
    ('/auth', AuthHandler),
    ('/logout', LogoutHandler),
    ('/accounts', AccountHandler),
    ('/sendAward', SendAwardHandler),
    ('/api/award/(.*)', ApiAwardHandler),
    ('/api/awards', ApiAwardCollectionHandler),
    ('/api/account/(.*)', ApiAccountHandler),
    ('/api/accounts', ApiAccountCollectionHandler),
    ('/recover', create_entities.RecoverHandler)
], config=config, debug=True)
# [END app]
