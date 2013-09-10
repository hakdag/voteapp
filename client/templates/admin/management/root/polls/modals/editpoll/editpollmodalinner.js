/* 
 * editpollmodalinner.js
 * Helpers for editpollmodalinner template.
 */

var poll;

Template.editpollmodalinner.events({
    'click button.saveEditPoll': function (event, template) {
        var oldPoll = Session.get("current_poll");
        var name = template.find("#Name").value;
        var url = template.find("#Url").value;
        var question = template.find("#Question").value;
        var answers = template.findAll(".answer");
        var ansCheck = true;
        answers.forEach(function (ans) {
            if (!ans.value) {
                ansCheck = false;
            }
        });

        if (name.length && question.length && ansCheck) {
            Session.set("editError", null);
            Session.set("editSuccess", "Saving poll...");
            // disable buttons...
            $(template.findAll(".modal-footer .btn")).attr('disabled', 'disabled');

            // create poll object...
            var editedPoll = { _id: oldPoll._id, name: name, question: question, url: url, answers: [] };
            // convert input elements from html into answer objects...
            answers.forEach(function (answer) {
                editedPoll.answers.push({ _id: $(answer).attr("answerid"), poll: editedPoll._Id, name: answer.value });
            });

            // add poll...
            Meteor.call('editPoll', editedPoll, function (error, result) {
                if (error) {
                    Session.set("editError", error.reason);
                }
                else {
                    Session.set("editSuccess", "Poll edited successfully.");
                    // enable buttons for next use.
                    $(template.findAll(".modal-footer .btn")).removeAttr('disabled', 'disabled');
                    // emptry fields for next use.
                    template.find("#Name").value = "";
                    template.find("#Question").value = "";
                    Session.set("editError", null);
                    Session.set("editSuccess", null);
                    // toggle modal manually.
                    $('#editPollModal').modal('toggle');
                }
            });
        }
        else {
            Session.set("editError", "It needs a name, a question and at least two answers, or why bother?");
        }
    },
    'click button.closeEditPoll': function () {
        Session.set("editError", null);
    },
    'click button.addmore': function (event, template) {
        var container = template.find("#answers-container");
        if (container) {
            $(container).append('<input type="text" class="form-control control-group answer" placeholder="Answer" answerid="">');
        }
    },
    'click a.deleteanswer': function (event, template) {
        var aid = this._id;
        console.log("answer to delete: " + aid);
        if (confirm("This will delete answer. Are you sure?")) {
            Meteor.call('deleteAnswer', aid, function (error, result) {
                if (error) {
                    Session.set("editError", error.reason);
                }
                else {
                    var poll = Polls.findOne(Session.get("current_poll")._id);
                    if (poll) {
                        Session.set("current_poll", poll);
                    }
                    Session.set("editError", null);
                }
            });
        }
    }
});

Template.editpollmodalinner.poll = function () {
    return Session.get("current_poll");
};

Template.editpollmodalinner.rendered = function () {
    $('#Name').friendurl({ id: 'Url' });
    $('a.deleteanswer').tooltip({ placement: 'top', html: 'Delete Answer' });
};

Template.editpollmodalinner.error = function () {
    return Session.get("editError");
};

Template.editpollmodalinner.success = function () {
    return Session.get("editSuccess");
};
