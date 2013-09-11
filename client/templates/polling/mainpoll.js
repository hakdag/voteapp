/* 
 * mainpoll.js
 * Helpers for mainpoll template.
 */
var answersHandle = Meteor.subscribe("allanswers");

Template.mainpoll.destroyed = function () {
    this.handle && this.handle.stop();
};
Template.mainpoll.rendered = function () {
    var self = this;
    if (!self.handle) {
        self.handle = Deps.autorun(function () {
            var answers = Answers.find({ poll: Session.get("selected_poll") }, { sort: { score: -1, name: 1 } }).fetch();

            var answersContainer = $(".ans-options");
            answersContainer.html("");

            if (answersHandle && answersHandle.ready()) {
                answers.forEach(function (answer) {
                    //var divAnswer = $("<div>").attr("class", "answer");
                    //var divBar = $("<div>").attr("class", "bar").attr("style", "width: " + answer.percent + "%");
                    //var spanName = $("<span>").attr("class", "name").text(answer.name);
                    //var spanPercent = $("<span>").attr("class", "percent").text(answer.percent + "%");

                    var selectedAnswer = Session.get("selected_answer");
                    var isAnswerSelected = answer._id && selectedAnswer && answer._id === selectedAnswer;

                    answersContainer.append(
                        $("<div>")
                            .attr("class", "answer" + (isAnswerSelected ? " selected" : ""))
                            .attr("objid", answer._id)
                            .append($("<div>").attr("class", "bar").attr("style", "width: " + answer.percent + "%")
                                .append($("<span>").attr("class", "name").text(answer.name))
                            )
                    ).append(
                        $("<span>")
                            .attr("class", "percent")
                            .text(answer.percent + "%")
                    );
                });
                /*
                <div class="total-votes">
                    <span class="text">Total Votes: </span>
                    <span class="sum">{{sum}}</span>
                </div>
                */
                answersContainer.append(
                    $("<div>")
                        .attr("class", "total-votes")
                        .append($("<span>").attr("class", "text").text("Total Votes: "))
                        .append($("<span>").attr("class", "sum").text(getSum()))
                );

                $(".answer").on("click", function (event) {
                    Session.set("selected_answer", $(this).attr("objid"));
                    $(".answer").removeClass("selected");
                    $(this).addClass("selected");
                });
            }
        });
    };
};

Template.mainpoll.answers = function () {
    return Answers.find({ poll: Session.get("selected_poll") }, { sort: { score: -1, name: 1 } }).fetch();
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
