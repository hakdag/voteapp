/* 
 * root.js
 * Helpers for root template.
 */

Template.root.dashboard = function () {
    var page = Session.get("page");
    return page && page === "dashboard";
};

Template.root.polls = function () {
    var page = Session.get("page");
    return page && page === "polls";
};
