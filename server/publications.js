/*
 * publications.js
 * Meteor.publish definitions
 */

// server: publish the polls collection.
Meteor.publish("allpolls", function () {
    return Polls.find({});
});

// server: publish the answers collection.
Meteor.publish("allanswers", function () {
    return Answers.find({});
});

// server: publish the votes collection.
Meteor.publish("allvotes", function () {
    return Votes.find({});
});