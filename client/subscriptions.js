/*
 * subscriptions.js
 * Meteor.subscriptions definitions
 */

// "allpolls" publishes data from server's "polls" collection.
Meteor.subscribe("allpolls");

// "allanswers" publishes data from server's "answers" collection.
var answersHandle = Meteor.subscribe("allanswers");

// "allvotes" publishes data from server's "votes" collection.
Meteor.subscribe("allvotes");
