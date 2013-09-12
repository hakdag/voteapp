Meteor.startup(function () {
	Accounts.onCreateUser(function (options, user) {
	    return null;
	});
	Accounts.validateNewUser(function (user) {
	    throw new Meteor.Error(403, "User creation is not supported.");
	});
});

headers = {
	list: {},
	get: function(header) {
		return header ? this.list[header] : this.list;
	}
};

var app = typeof WebApp != 'undefined' ? WebApp.connectHandlers : __meteor_bootstrap__.app;
app.use(function(req, res, next) {
    reqHeaders = req.headers;
    return next();
});

Meteor.methods({
    'getReqHeader': function(header) {
    	return reqHeaders[header];
    },
    'getReqHeaders': function () {
        return reqHeaders;
    }
});
