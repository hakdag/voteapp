/* 
 * voteapp.js
 * Helpers for voteapp template.
 */

Template.voteapp.currentPage = function () {
    console.log("voteapp.currentPage: " + Session.get("page"));
    return Session.get("page");
};
