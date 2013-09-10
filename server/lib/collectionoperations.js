Meteor.methods({
    'createPoll': function (poll) {
        // check if already there is a poll with same name...
        var oldPoll = Polls.findOne({ name: poll.name });
        if (oldPoll) {
            throw new Meteor.Error(413, "Poll name must be unique. There is already a poll with same name.");
            return null;
        }
        // insert poll and its answers...
        return Polls.insert({ name: poll.name, url: poll.url, question: poll.question, sum: 0, createDate: new Date() }, function (error, pollId) {
            if (!error) {
                poll.answers.forEach(function (ans) {
                    Answers.insert({ poll: pollId, name: ans, score: 0, percent: 0 }, function (error, ansId) {
                        if (error) {
                            throw new Meteor.Error(413, "Insert answer failed. Error details: " + error);
                        }
                    });
                });
            }
            else {
                throw new Meteor.Error(413, "Insert poll failed. Error details: " + error);
            }
        });
    },
    'editPoll': function (editedPoll) {
        var poll = Polls.findOne({ _id: editedPoll._id });
        if (poll) {
            // update poll if name or question were changed...
            if (editedPoll.name !== poll.name || editedPoll.question !== poll.question) {
                Polls.update(poll, { $set: { name: editedPoll.name }, $set: { question: poll.question } });
            }
            // update answers of poll if they were changed...
            if (editedPoll.answers && editedPoll.answers.length > 1) {
                // must handle edit answer content, add new answer if there is, and delete answer...
                var answers = Answers.find({ poll: editedPoll._id }).fetch();

                // convert db entity into an array of objects...
                var objAnswers = [];
                answers.forEach(function (answer) {
                    objAnswers.push({ _id: answer._id, poll: editedPoll._Id, name: answer.name, score: answer.score, percent: answer.percent });
                });

                // do editing...
                answers.forEach(function (answer) {
                    var newAnswer = _.find(editedPoll.answers, function (a) { return a._id == answer._id; });
                    if (newAnswer && newAnswer.name !== answer.name) {
                        Answers.update(answer, { $set: { name: newAnswer.name } });
                    }
                });

                // do deleting...
                answers.forEach(function (answer) {
                    var newAnswer = _.find(editedPoll.answers, function (a) { return a._id == answer._id; });
                    if (!newAnswer) {
                        Answers.remove(answer);
                    }
                });

                // do creating...
                editedPoll.answers.forEach(function (newAnswer) {
                    var answer = _.find(answers, function (a) { return a._id == newAnswer._id; });
                    if (!answer) {
                        Answers.insert({ poll: editedPoll._id, name: newAnswer.name, score: 0, percent: 0 });
                    }
                });

                return {
                    _id: editedPoll._id,
                    name: editedPoll.name,
                    url: editedPoll.url,
                    question: editedPoll.question,
                    sum: editedPoll.sum,
                    createDate: editedPoll.createDate,
                    //answers: _.intersection(objAnswers, editedPoll.answers)
                    answers: Answers.find({ poll: editedPoll._id }).fetch()
                };
            }
        }
        else {
            throw new Meteor.Error(414, "Poll could not be found.");
            return null;
        }
    },
    'getAnswersForPoll': function (id) {
        return Answers.find({ poll: id }).fetch();
    },
    'getPoll': function (id) {
        var poll = Polls.findOne({ _id: id });
        if (poll) {
            var answers = Answers.find({ poll: id }).fetch();
            var objAnswers = [];
            answers.forEach(function (answer) {
                objAnswers.push({ _id: answer._id, poll: id, name: answer.name, score: answer.score, percent: answer.percent });
            });
            var obj = { _id: poll._id, name: poll.name, url: poll.url, question: poll.question, sum: poll.sum, createDate: poll.createDate, answers: objAnswers };
            return obj;
        }
        else {
            return null;
        }
    },
    'voteForAnswer': function (id, vote) {
        var answer = Answers.findOne(id);
        var poll = Polls.findOne(answer.poll);
        if (poll && answer) {
            Answers.update(answer, { $inc: { score: 1 } }, function (error) {
                if (error) {
                    throw new Meteor.Error(411, "Answer could not be updated.");
                    // log error...
                    // Log(error);
                }
            });
            Polls.update(poll, { $inc: { sum: 1 } }, function (error) {
                if (error) {
                    throw new Meteor.Error(411, "Poll could not be updated. " + poll.name);
                    // log error...
                    // Log(error);
                }
            });

            var poll = Polls.findOne(poll._id);
            Answers.find({ poll: poll._id }).forEach(function (ans) {
                ans.score && Answers.update(ans, { $set: { percent: Math.round((parseInt(ans.score) / parseInt(poll.sum)) * 100) } });
            });
        }
    },
    'userVoted': function (vote) {
        if (vote) {
            if (vote.cookie != null || vote.cookie != '' || vote.cookie != 'undefined')
                Votes.insert({ cookie: vote.cookie, hash: vote.hash, ip: vote.ip, poll: vote.poll, timestamp: vote.timestamp, useragent: vote.useragent, vote: vote.vote }, function (error) {
                    if (error) {
                        throw new Meteor.Error(411, "Vote could not be added.");
                        // log error...
                        // Log(error);
                    }
                });
        }
    },
    'deleteAnswer': function (id) {
        if (id) {
            Answers.remove(id, function (error) {
                if (error) {
                    throw new Meteor.Error(411, "Answer could not be deleted.");
                    // log error...
                    // Log(error);
                }
            });
        }
    }
});
