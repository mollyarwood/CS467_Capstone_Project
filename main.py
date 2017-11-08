<<<<<<< HEAD
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

    def delete(self):
        ah = create_entities.AccountHandler()
        response = create_entities.AccountHandler.delete(ah, yaml.safe_load(self.request.body))
        self.response.write(response)


class SendAwardHandler(session_handler.BaseHandler):
    
    def post(self):
        # SAVE AWARD IN DB
        ah = create_entities.AwardHandler()
        body = yaml.safe_load(self.request.body)
        #body["sender"] = self.session.get("user")
        body["sender"] = "Bob"
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

    

#class PassHandler(session_handler.BaseHandler):
     
#   def post(self):
#        ah = create_entities.RecoverHandler()
#        response['form'] = create_entities.RecoverHandler.post()
        #self.response.write(response)
#        self.response.write("hi there")


# [START app]
app = webapp2.WSGIApplication([
    ('/auth', AuthHandler),
    ('/logout', LogoutHandler),
    ('/accounts', AccountHandler),
    ('/accounts/(.*)', create_entities.AccountHandler),
    ('/recover', create_entities.RecoverHandler),
    ('/sendAward', SendAwardHandler),
    ('/api/award/(.*)', ApiAwardHandler),
    ('/api/awards', ApiAwardCollectionHandler),
    ('/api/account/(.*)', ApiAccountHandler),
    ('/api/accounts', ApiAccountCollectionHandler),
    ('/query', create_entities.QueryHandler)
], config=config, debug=True)
# [END app]
=======
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
from pylatex import Document, Command, Figure
from pylatex.utils import italic, NoEscape

#generate random string for the session
key = binascii.hexlify(os.urandom(24))

config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': key,
}

# THIS ALLOWS FOR PATCH REQUESTS
allowed_methods = webapp2.WSGIApplication.allowed_methods
new_allowed_methods = allowed_methods.union(('PATCH',))
webapp2.WSGIApplication.allowed_methods = new_allowed_methods

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
                "name": self.session.get('name'),
                "userType": self.session.get('userType')
            }))

    # login handler
    def post(self):
        post_data = yaml.safe_load(self.request.body)
        # logging.info(self.request.body)
        username_entered = str(post_data['username'])
        password_entered = str(post_data['password'])
        userFound = False

        account_creation_date = ''
        account_last_modified = ''
        account_id = ''
        name = ''

        for entity in create_entities.Account.query():
            # logging.info(entity)
            if entity.username == username_entered:
                if entity.password == password_entered:
                    # logging.info(entity.account_type)
                    self.session['user'] = entity.username
                    self.session['name'] = entity.name
                    self.session['userType'] = entity.account_type
                    self.session['id'] = entity.id
                    account_id = entity.id
                    account_creation_date = entity.creation_date.strftime("%m/%d/%Y %H:%M:%S")
                    account_last_modified = entity.last_modified.strftime("%m/%d/%Y %H:%M:%S")
                    name = entity.name
                    userFound = True

        if userFound:
            self.response.write(json.dumps({
                "loggedIn": True,
                "id": account_id,
                "name": name,
                "userType": self.session['userType'],
                "creation_date": account_creation_date,
                "last_modified": account_last_modified
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

    def patch(self):
        body = yaml.safe_load(self.request.body)
        logging.info(body)
		
        # IF PASSWORD IS SENT, CONFIRM CURRENT PASSWORD IS CORRECT
        if "currentPassword" in body:
            account = create_entities.Account.query(create_entities.Account.username == self.session.get('user')).get()
            if body["currentPassword"] != account.password:
                self.response.write(json.dumps({"errors": "Current password is incorrect"}))
                return
    
        # ADD ID TO BODY, WHICH WILL BE USED IN THE DB QUERY
        body['id'] = self.session.get('id')
        ah = create_entities.AccountHandler()
        response = create_entities.AccountHandler.patch(ah, body)
        logging.info(response)
        self.response.write(json.dumps({ "userDetails": response }))
        


class SendAwardHandler(session_handler.BaseHandler):

    def post(self):
        # PARSE DATA FROM REQUEST
        body = yaml.safe_load(self.request.body)
        body["sender"] = self.session.get("user")
        sender = body["sender"]
        recipient_name = body["recipient_name"]
        recipient_email = body["recipient_email"]
        logging.info(body)
	
        # SAVE AWARD IN DB
        ah = create_entities.AwardHandler()
        response = create_entities.AwardHandler.post(ah, body)
        self.response.write(response)
		
        # CONSTRUCT AWARD VIA LATEX
        employee_of_the_month_message = "Employee of the Month"
        img_dir = '../img/'
        pdf_dir = 'rsc/pdf/'
        img_name = 'signature.png'

        doc = Document('test')
        doc.append('Congratulations! This award is for \n')
        doc.append(italic(recipient_name))
        doc.append('\nFor \n')
        doc.append(italic(employee_of_the_month_message))
        with doc.create(Figure(position='h!')) as signature_img:
            signature_img.add_image(img_dir + img_name, width='120px')

        doc.generate_pdf('/rsc/pdf/test', clean_tex=True, compiler='pdflatex')


        # SEND EMAIL
        filename = pdf_dir + 'test.pdf'
        f = open(filename, 'r')
        mail.send_mail(sender=sender,
        to=recipient_email,
        subject="Congratulations " + recipient_name + "! You received an award!",
        body="See attachment.",
        attachments=[(filename, f.read())])
 

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
        name = self.request.GET['name']
        ah = create_entities.AwardCollectionHandler()
        response = create_entities.AwardCollectionHandler.get(ah, name)
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

    def patch(self, id=None):
        body = self.request.body
        ah = create_entities.AccountHandler()
        response = create_entities.AccountHandler.patch(ah, id, body)
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



#class PassHandler(session_handler.BaseHandler):

#   def post(self):
#        ah = create_entities.RecoverHandler()
#        response['form'] = create_entities.RecoverHandler.post()
        #self.response.write(response)
#        self.response.write("hi there")


# [START app]

allowed_methods = webapp2.WSGIApplication.allowed_methods
new_allowed_methods = allowed_methods.union(('PATCH','DELETE',))
webapp2.WSGIApplication.allowed_methods = new_allowed_methods

app = webapp2.WSGIApplication([
    ('/auth', AuthHandler),
    ('/logout', LogoutHandler),
    ('/accounts', AccountHandler),
    ('/accounts/(.*)', create_entities.AccountHandler),
    ('/recover', create_entities.RecoverHandler),
    ('/sendAward', SendAwardHandler),
    ('/api/award/(.*)', ApiAwardHandler),
    ('/api/awards', ApiAwardCollectionHandler),
    ('/api/account/(.*)', ApiAccountHandler),
    ('/api/accounts', ApiAccountCollectionHandler)
], config=config, debug=True)
# [END app]

