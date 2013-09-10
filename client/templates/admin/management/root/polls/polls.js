/* 
 * root.js
 * Helpers for root template.
 */

Template.polls.list = function () {
    var list = [];
    var polls = Polls.find();
    var index = 1;
    polls.forEach(function (poll) {
        list.push({ _id: poll._id, number: index++, name: poll.name, url: poll.url, question: poll.question, sum: poll.sum, createDate: poll.createDate });
    });
    return list;
};

Template.polls.poll_selected = function () {
    return Session.get("clicked_poll");
};

Template.polls.events({
    'click button.editpoll': function () {
        // popup for editing...
        if (Session.get("clicked_poll")) {
            /*
            Meteor.call('getAnswersForPoll', Session.get("clicked_poll"), function (error, result) {
                if (error) {
                    alert(error);
                }
                else {
                    Session.set("poll_answers", result);
                    $('#editPollModal').modal({ show: true });
                }
            });
            */
            Meteor.call('getPoll', Session.get("clicked_poll"), function (error, result) {
                if (error) {
                    alert(error);
                }
                else {
                    Session.set("current_poll", result);
                    $('#editPollModal').modal({ show: true });
                }
            });
        }
    },
    'click button.deletepoll': function () {
        var poll = Polls.findOne(Session.get("clicked_poll"));
        if (poll) {
            var r = confirm("This will delete Poll(" + poll.name + ") and all of its answers. Are you sure?");
            if (r) {
                // delete poll, its answers and votes...
                alert("poll deleted.");
            }
        }
    }
});

Template.polls.clicked_poll = function () {
    var poll = Polls.findOne(Session.get("clicked_poll"));
    return poll && poll.name;
};
