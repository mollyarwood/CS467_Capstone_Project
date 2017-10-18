import webapp2
import session_handler
import create_entities
import json
import yaml
import logging

config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': 'my-super-secret-key',
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

        # A real check to database for user goes here, this is placeholder
        # if username == "admin" and password == "pass":
            # userType = 'admin'
        # End of place holder
        for entity in create_entities.Account.query():
            logging.info(entity)
            if entity.username == username_entered:
                if entity.password == password_entered:
					
                    logging.info(entity.account_type)
                    self.session['user'] = entity.username
                    self.session['userType'] = entity.account_type

                    self.response.write(json.dumps({
	                    "loggedIn": True,
	                    "userType": "user"
                    }))
					
		
        self.response.write(json.dumps({
	        "errors": "invalid login"
        }))
		
		
class LogoutHandler(session_handler.BaseHandler):
    def get(self):
        self.session.clear()


# [START app]
app = webapp2.WSGIApplication([
	('/auth', AuthHandler),
    ('/logout', LogoutHandler)
	# ('/accountManagement', AccountManagement)
	# ('/account(.*)', create_entities.AccountHandler),
	# ('/accounts', create_entities.AccountCollectionHandler),
	# ('/awards', create_entities.AwardCollectionHandler),
	# ('/(.*)', create_entities.AccountHandler),
	# ('/(.*)', create_entities.AwardHandler)
], config=config, debug=True)
# [END app]
