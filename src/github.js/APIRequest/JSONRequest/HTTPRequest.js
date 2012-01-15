/**
 * HTTP request class
 * Makes HTTP requests easy
 * 
 * @param {Object} options List of options to pass to the class
 */
function HTTPRequest(options) {
	// Set the default options
	this.setOptions({
		method: 'GET',
		async: true,
		url: null,
		user: null,
		password: null,
		data: null
	});
	
	// Set the users passed options
	this.setOptions(options);
}

/**
 * Sets the requests options
 * 
 * @param {Object} options Your list of options
 */
HTTPRequest.prototype.setOptions = setOptions;

/**
 * Sends the HTTP request configured in the options object
 * 
 * @param {Function} callback The function to send the results to if asyncronous
 * @returns {String} The results will be returned if it is not an asyncronous request
 */
HTTPRequest.prototype.send = function(callback) {
	// Initialise the request
	var request = new XMLHttpRequest();
	request.open(this.options.method, this.options.url, this.options.async);
	
	// Authenticate if required
	if(this.options.user && this.options.password) {
		request.setRequestHeader('Authorization', 'Basic ' + btoa(this.options.user + ':' + this.options.password));
	}
	
	if(this.options.async && callback) {
		// Add the event listeners
		request.addEventListener('readystatechange', function() {
			// Check if the request is done
			if(request.readyState === 4) {
				// Handle different status codes
				if(request.status >= 200 && request.status < 300) {
					// Send the data to the callback
					// If there is no data, pass true
					callback.call(null, request.responseText || true);
				}
				else {
					// The request did not come back well
					// Pass false back
					// This could be a gist starred check in which case a 404 means it is not starred
					callback.call(null, false);
				}
			}
		});
	}
	
	// Send the request
	request.send(JSON.stringify(this.options.data));
	
	// If it is not an async request, send back the results instantly
	if(!this.options.async) {
		return request.responseText;
	}
};