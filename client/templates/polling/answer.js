/* 
 * root.js
 * Helpers for root template.
 */

Template.answer.selected = function () {
    return Session.equals("selected_answer", this._id) ? "selected" : '';
};

Template.answer.events({
    'click': function () {
        Session.set("selected_answer", this._id);
    }
});
