/* 
 * showpoll.js
 * Helpers for showpoll template.
 */

Template.showpoll.clicked = function () {
    return Session.equals("clicked_poll", this._id) ? "clicked" : '';
};

Template.showpoll.events({
    'click': function () {
        Session.set("clicked_poll", this._id);
    }
});
