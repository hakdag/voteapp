/* 
 * addpollmodalinner.js
 * Helpers for addpollmodalinner template.
 */

Template.addpollmodalinner.events({
    'click button.saveAddPoll': function (event, template) {
        var name = template.find("#Name").value;
        var url = template.find("#Url").value;
        var question = template.find("#Question").value;
        var answers = template.findAll(".answer");
        console.log(answers.length);
        var ansCheck = true;
        answers.forEach(function (ans) {
            if (!ans.value) {
                ansCheck = false;
            }
        });

        if (name.length && question.length && ansCheck) {
            console.log("name: " + name + ", question: " + question);
            Session.set("createError", null);
            Session.set("createSuccess", "Saving poll...");
            // disable buttons...
            $(template.findAll(".modal-footer .btn")).attr('disabled', 'disabled');

            // create poll object...
            var poll = { name: name, question: question, url: url, answers: [] };
            answers.forEach(function (ans) {
                poll.answers.push(ans);
            });

            // add poll...
            Meteor.call('createPoll', poll, function (error, newPoll) {
                if (error) {
                    Session.set("createError", error);
                }
                else {
                    Session.set("createSuccess", "Poll added successfully.");
                    // enable buttons for next use.
                    $(template.findAll(".modal-footer .btn")).removeAttr('disabled', 'disabled');
                    // emptry fields for next use.
                    template.find("#Name").value = "";
                    template.find("#Question").value = "";
                    Session.set("createSuccess", null);
                    // toggle modal manually.
                    $('#myModal').modal('toggle');
                }
            });
        }
        else {
            Session.set("createError", "It needs a name, a question and at least two answers, or why bother?");
        }
    },
    'click button.closeAddPoll': function () {
        Session.set("createError", null);
    },
    'click button.addmore': function (event, template) {
        var container = template.find("#answers-container");
        if (container) {
            $(container).append('<div class="row-fluid"><div class="span12"><input type="text" class="form-control control-group answer" placeholder="Answer"></div></div>');
        }
    }
});

Template.addpollmodalinner.rendered = function () {
    $('#Name').friendurl({ id: 'Url' });
};

Template.addpollmodalinner.error = function () {
    return Session.get("createError");
};

Template.addpollmodalinner.success = function () {
    return Session.get("createSuccess");
};
