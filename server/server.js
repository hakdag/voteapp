Meteor.startup(function () {
	// After management panel will be implemented, commented code blocks will be removed.
	//Polls.remove({});
	//Polls.update({_id: "2GFQmWrzDPHu7SXDv"}, {$set: {question: "What is your favourite team?"}});
	//Polls.update({_id: "j77Xmyxg2BYJK6mLS"}, {$set: {question: "Which is the most interesting city?"}});
	if (Polls.find().count() === 0) {
		// db clean up
		//Votes.remove({});
		//Answers.remove({});
		var pollId = Polls.insert({name: "Favourite Team", url: "favourite-team", question: "What is your favourite team?", sum: 0, createDate: new Date()});
		var contents = ["Barcelona",
			"Manchester United",
			"Real Madrid",
			"Galatasaray",
			"Roma",
			"Dinamo Kiev"];
		for (var i = 0; i < contents.length; i++)
			Answers.insert({poll: pollId, name: contents[i], score: 0, percent: 0});
	    pollId = Polls.insert({ name: "Most Interesting City", url: "most-interesting-city", question: "Which is the most interesting city?", sum: 0, createDate: new Date() });
		contents = ["Barcelona",
			"Paris",
			"Roma",
			"Istanbul",
			"Moscow",
			"New York"];
		for (var i = 0; i < contents.length; i++)
			Answers.insert({poll: pollId, name: contents[i], score: 0, percent: 0});
	}
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
