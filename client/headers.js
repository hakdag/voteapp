// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "answers".
headers = {
	vote: {},
	list: {},
	get: function(header, callback) {
		return header ? this.list[header] : this.list;
	}
}
// This is the best all-round solution.  But we might consider only fetching the required headers, when needed,
// with callbacks, and caching the result for future calls.  At time of writing, this is unneeded.
Meteor.call('getReqHeaders', function(error, result) {
	if (error) {
		console.log(error);
	}
	else {
		headers.list = result;
		headers.vote = new Vote(1, 1, headers.get("x-forwarded-for"), headers.get("user-agent"), headers.get("cookie"));
		//console.log(result);
	}
});