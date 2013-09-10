/* 
 * sidebar.js
 * Helpers for sidebar template.
 */

Template.sidebar.items = function () {
    var page = Session.get("page");
    return [{ active: page && page === "dashboard", url: "/admin", title: "Dashboard" }, { active: page && page === "polls", url: "/admin/polls", title: "Polls" }];
};
