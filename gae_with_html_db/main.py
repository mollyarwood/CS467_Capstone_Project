#!/usr/bin/env python2

import os
import webapp2
from webapp2_extras import jinja2
import json
from google.appengine.ext import ndb

class BaseHandler(webapp2.RequestHandler):

	@webapp2.cached_property
	def jinja2(self):
		return jinja2.get_jinja2(app=self.app)

	def render_template(self, filename, **template_args):
		self.response.write(self.jinja2.render_template(filename, **template_args))

class Shout(ndb.Model):
	message = ndb.StringProperty(required=True)
	when = ndb.DateTimeProperty(auto_now_add=True)


class IndexHandler(BaseHandler):

	def get(self):
		shouts = ndb.gql(
			'SELECT * FROM Shout')
		values = {
			'shouts' : shouts
		}


		self.render_template('main.html', values=values)

	def post(self):
		shout = Shout(message=self.request.get('message'))
		shout.put()
		self.redirect('/')



#check to see if program is running on dev server or prod
DEBUG = os.environ.get('SERVER_SOFTWARE', '').startswith('Dev')

app = webapp2.WSGIApplication([
	('/', IndexHandler),
], debug=DEBUG)