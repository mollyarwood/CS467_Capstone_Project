// base.js

/**
 * @fileoverview
 * Provides methods for the Hello Endpoints sample UI and interaction with the
 * Hello Endpoints API.
 */

/** google global namespace for Google projects. */
var google = google || {};

/** appengine namespace for Google Developer Relations projects. */
google.appengine = google.appengine || {};

/** samples namespace for App Engine sample code. */
google.appengine.samples = google.appengine.samples || {};

/** hello namespace for this sample. */
google.appengine.samples.hello = google.appengine.samples.hello || {};

/**
 * Initializes the application.
 * @param {string} apiRoot Root of the API's path.
 */
google.appengine.samples.hello.init = function(apiRoot) {
  // Loads the OAuth and helloworld APIs asynchronously, and triggers login
  // when they have completed.
  var apisToLoad;
  var callback = function() {
    if (--apisToLoad == 0) {
      google.appengine.samples.hello.enableButtons();
    }
  }

  apisToLoad = 1; // must match number of calls to gapi.client.load()
  gapi.client.load('helloworld', 'v1', callback, apiRoot);
};

/**
 * Enables the button callbacks in the UI.
 */
google.appengine.samples.hello.enableButtons = function() {
  var getCreds = document.querySelector('#getCredentials');
  getCreds.addEventListener('click', function(e) {
    google.appengine.samples.hello.getCreds(
        document.querySelector('#username').value);
		document.querySelector('#password').value);
  });
};