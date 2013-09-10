/* 
 * breadcrumb.js
 * Helpers for breadcrumb template.
 */

Template.breadcrumb.items = function () {
    var page = Session.get("page");
    var array = [];
    switch (page) {
        case "polls":
            array.push({ url: "/admin", title: "Dashboard", last: false });
            array.push({ url: "/admin/polls", title: "Polls", last: true });
            break;
        default:
            array.push({ url: "/admin", title: "Dashboard", last: true });
    }
    return array;
};
