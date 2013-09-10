/* 
 * mainpoll.js
 * Helpers for mainpoll template.
 */

Template.mainpoll.answers = function () {
    return Answers.find({ poll: Session.get("selected_poll") }, { sort: { score: -1, name: 1 } });
};

Template.mainpoll.votes = function () {
    return Votes.find({});
};

Template.mainpoll.pollquestion = function () {
    var poll = Polls.findOne(Session.get("selected_poll"));
    return poll && poll.question;
};

Template.mainpoll.selected_name = function () {
    var answer = Answers.findOne(Session.get("selected_answer"));
    return answer && answer.name;
};

Template.mainpoll.answer = function () {
    return Session.get("selected_answer");
};

Template.mainpoll.events({
    'click input.inc': function () {
        var isUserVoted = userVoted();
        if (!isUserVoted) {
            Meteor.call('voteForAnswer', Session.get("selected_answer"), function (error, result) {
                if (error) {
                    Session.set("voteError", error.reason);
                }
                else {
                    Session.set("voteError", null);
                }
            });
            //addPercents();
            userVoted(true);
        }
    }
});

Template.mainpoll.error = function () {
    return Session.get("voteError");
};

Template.mainpoll.sum = function () {
    return getSum();
};

Template.mainpoll.isUserVoted = function () {
    return userVoted();
};

var userVoted = function (val) {
    return false;
    if (val) {
        Meteor.call('userVoted', headers.vote, function (error, result) {
            if (error) {
                //console.log(headers.vote);
            }
        });
        //if (headers.vote.cookie != null || headers.vote.cookie != '' || headers.vote.cookie != 'undefined')
        //    Votes.insert({ cookie: headers.vote.cookie, hash: headers.vote.hash, ip: headers.vote.ip, poll: headers.vote.poll, timestamp: headers.vote.timestamp, useragent: headers.vote.useragent, vote: headers.vote.vote });
    }
    else {
        var voted = Votes.findOne({ cookie: headers.vote.cookie });
        return voted ? voted : false;
    }
};

var getSum = function (callback) {
    var poll = Polls.findOne(Session.get("selected_poll"));
    if (callback && poll)
        callback(poll.sum);
    else
        return poll && poll.sum;
};
