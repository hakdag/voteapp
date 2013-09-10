Answers = new Meteor.Collection("answers");
Votes = new Meteor.Collection("votes");
Polls = new Meteor.Collection("polls");
console.log(Polls._collection.docs);
console.log(Answers._collection.docs);

Meteor.startup(function () {
    Backbone.history.start({ pushState: true, root: "/" });
    console.log("Meteor.startup > selected_poll: " + Session.get("selected_poll"));
    /*
    Accounts.createUser({ username: "admin", email: "de_bug@hotmail.com", password: "12345678" }, function (error) {
        console.log(error);
    });
    */

    /*
    Meteor.loginWithPassword("admin", "12345678", function (error) {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Admin logged.");
        }
    });
    */
    Accounts.config({ sendVerificationEmail: false, forbidClientAccountCreation: true });
});

var VoteAppRouter = Backbone.Router.extend({
    routes: {
        "admin": "admin",
        "admin/polls": "polls",
        ":url": "showPoll"
    },
    admin: function () {
        console.log("Backbone.admin");
        Session.set('page', 'dashboard');
    },
    polls: function () {
        console.log("Backbone.polls");
        Session.set('page', 'polls');
    },
    showPoll: function (url) {
        console.log("Backbone.main > selected_poll: " + Session.get("selected_poll"));
        console.log("Backbone.main > url: " + url);
        Session.set("url", url);
        var poll = getPollByUrl(url);
        if (poll) {
            console.log("Backbone.main > poll: " + poll._id);
            var oldPoll = Session.get("selected_poll");
            if (oldPoll !== poll._id) {
                Session.set("selected_poll", poll._id);
                Session.set('page', null);
                Session.set("tag_filter", null);
            }
        }
    },
    setPoll: function (url) {
        console.log("Backbone.setPoll > url: " + url);
        this.navigate(url, true);
    }
});

var getPollByUrl = function (url) {
    return Polls.findOne({ url: url });
};

Router = new VoteAppRouter;

Deps.autorun(function () {
    if (!Session.get("page")) {
        console.log("Deps.autorun > selected_poll: " + Session.get("selected_poll"));
        console.log("Deps.autorun > url: " + Session.get("url"));
        var poll = getPollByUrl(Session.get("url"));
        if (poll) {
            console.log("Deps.autorun > poll: " + poll._id);
            var oldPoll = Session.get("selected_poll");
            if (oldPoll !== poll._id) {
                Session.set("selected_poll", poll._id);
            }
        }
        else {
            var poll_id = Session.get("selected_poll");
            if (!poll_id) {
                var poll = Polls.findOne();
                if (poll) {
                    Session.set("selected_poll", poll._id);
                }
            }
        }
    }
});
