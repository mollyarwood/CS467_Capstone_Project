import os
import webapp2
import session_handler
import create_entities
import json
import yaml
import binascii
import logging


#generate random string for the session
key = binascii.hexlify(os.urandom(24))

config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': key,
}

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
        logging.info(self.request.body)
        username_entered = str(post_data['username'])
        password_entered = str(post_data['password'])
        userFound = False

        for entity in create_entities.Account.query():
            logging.info(entity)
            if entity.username == username_entered:
                if entity.password == password_entered:
                    logging.info(entity.account_type)
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

# [START app]
app = webapp2.WSGIApplication([
	('/auth', AuthHandler),
    ('/logout', LogoutHandler),
    ('recover', create_entities.RecoverHandler)
], config=config, debug=True)
# [END app]
