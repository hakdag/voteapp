/* 
 * dashboard.js
 * Helpers for dashboard template.
 */

Template.dashboard.list = function () {
    console.log("dashboard.list");
    return Answers.find();
};
