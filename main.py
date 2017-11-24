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
import re
from cStringIO import StringIO
from time import mktime
from google.appengine.api import mail
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch, cm
from reportlab.rl_config import defaultPageSize
from reportlab.lib.units import inch
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.utils import ImageReader
import io


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
                "name": self.session.get('name'),
                "username": self.session.get('user'),
                "userType": self.session.get('userType')
            }))

    # login handler
    def post(self):
        post_data = yaml.safe_load(self.request.body)
        # logging.info(self.request.body)
        username_entered = str(post_data['username'])
        password_entered = str(post_data['password'])
        userFound = False

        #check username is an email address
        if not re.match(r"[^@]+@[^@]+\.[^@]+", username_entered):
            return self.response.write(json.dumps({
               "errors": "invalid login - not email address"
            }))


        account_creation_date = ''
        account_last_modified = ''
        account_id = ''
        name = ''
        username = ''

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
                    username = entity.username
                    userFound = True

        if userFound:
            self.response.write(json.dumps({
                "loggedIn": True,
                "id": account_id,
                "name": name,
                "username": username,
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

    def delete(self, id=None):
        ah = create_entities.AccountHandler()
        response = create_entities.AccountHandler.delete(ah, id)
        self.response.write(response)

    def patch(self):

        # CHECK HEADER IF CONTENT TYPE IS FORMDATA
        # IF YES, THIS IS A FILE BYTESTREAM, WHICH MUST
        # BE HANDLED DIFFERENTLY
        header = self.request.headers
        logging.info(header)

        if header['Content_Type'] == 'image/jpeg':

            # ADD ID TO BODY, WHICH WILL BE USED IN THE DB QUERY
            body = dict()
            body['blob'] = self.request.body
            body['id'] = self.session.get('id')
            ah = create_entities.AccountHandler()
            response = create_entities.AccountHandler.patch(ah, body)
            logging.info(response)
            self.response.write(json.dumps({ "userDetails": response }))

            # self.response.write(json.dumps({ "userDetails": "response" }))

        else:

            # IF PASSWORD IS SENT, CONFIRM CURRENT PASSWORD IS CORRECT
            body = yaml.safe_load(self.request.body)
            logging.info(body)
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
        body["sender"] = self.session.get('user')
        sender = body["sender"]
        # logging.info(sender)

        # GET RECIPIENT'S NAME
        account = create_entities.Account.query(create_entities.Account.username == body["recipient_username"]).get()
        recipient_name = account.name
        body["recipient_name"] = recipient_name

        logging.info(recipient_name)

        recipient_email = body["recipient_email"]
        award_type = body["award_type"]
        sender_name = self.session.get('name')
        date = datetime.date.today().strftime("%B %d, %Y")


        # SAVE AWARD IN DB
        ah = create_entities.AwardHandler()
        response = create_entities.AwardHandler.post(ah, body)

        # GET SIGNATURE AND CONVERT IT FROM BLOB TO BYTEBUFFER
        id = self.session.get("id")
        account = create_entities.Account.query(create_entities.Account.id == id).get()
        signature = account.signature


        # LOAD THE JPG DIRECTLY, TO SEE IF THE BLOB IS INVALID
        # img = canvas.ImageReader(StringIO(open('img.jpg', 'rb').read()))
        img = canvas.ImageReader(StringIO(signature))

        # CREATE PDF BYTESTREAM
        pdfFile = StringIO()
        c = canvas.Canvas(pdfFile)
        c.translate(inch, inch)
        c.setFont("Times-Bold", 40)
        c.setPageSize(landscape(letter))
        c.drawCentredString(9*inch/2.0, 6*inch, "CONGRATULATIONS!")

        c.line(.5*inch,5.2*inch,8.5*inch,5.2*inch)
        c.setFont("Times-Roman", 18)
        c.drawCentredString(9*inch/2.0, 4*inch, "THE CORPORATION PROUDLY PRESENTS THE AWARD OF")

        if award_type == "employeeOfWeek":
            award_type_msg = "EMPLOYEE OF THE WEEK"
        elif award_type == "employeeOfMonth":
            award_type_msg = "EMPLOYEE OF THE MONTH"

        c.setFont("Times-Bold", 26)
        c.drawCentredString(9*inch/2.0, 3.5*inch, award_type_msg)
        c.setFont("Times-Roman", 18)
        c.drawCentredString(9*inch/2.0, 2.5*inch, "TO THE MOST HONORABLE")
        c.setFont("Times-Bold", 26)
        # c.drawCentredString(9*inch/2.0, 2*inch, recipient_name)


        c.setFont("Times-Roman", 12)
        c.line(0*inch,.2*inch,2.5*inch,.2*inch)
        c.drawString(0*inch, 0*inch, "DATE")
        c.line(3.5*inch,.2*inch,6*inch,.2*inch)
        c.drawString(3.5*inch, 0*inch, "EMPLOYER NAME")
        c.line(7*inch,.2*inch,9*inch,.2*inch)
        c.drawString(7*inch, 0*inch, "SIGNATURE")
        c.drawImage(img, 7*inch, .3*inch, 1.5*inch, 1.5*inch)

        c.setFont("Times-Roman", 18)
        c.drawString(3.5*inch, .3*inch, sender_name)
        c.drawString(0*inch, .3*inch, date)
        c.save()


        # SEND EMAIL
        filename = 'Award.pdf'
        mail.send_mail(sender="employeeAward@cs467capstone.appspotmail.com",
        to=recipient_email,
        subject="Congratulations ", #+ recipient_name + "! You received an award!",
        body="See attachment.",
        attachments=[(filename, pdfFile.getvalue())])

		# WRITE RESPONSE
        self.response.write(json.dumps({"award": response}))


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
        self.response.write(json.dumps(response))



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



# [START app]

allowed_methods = webapp2.WSGIApplication.allowed_methods
new_allowed_methods = allowed_methods.union(('PATCH','DELETE',))
webapp2.WSGIApplication.allowed_methods = new_allowed_methods

app = webapp2.WSGIApplication([
    ('/auth', AuthHandler),
    ('/logout', LogoutHandler),
    ('/accounts', AccountHandler),
    ('/accounts/(.*)', AccountHandler),
    ('/recover', create_entities.RecoverHandler),
    ('/sendAward', SendAwardHandler),
    ('/api/award/(.*)', ApiAwardHandler),
    ('/api/awards', ApiAwardCollectionHandler),
    ('/api/account/(.*)', ApiAccountHandler),
    ('/api/accounts', ApiAccountCollectionHandler),
    ('/query', create_entities.QueryHandler)
], config=config, debug=True)
# [END app]
