"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const releases_1 = require("./releases");
const ui_1 = require("./ui");
const render_1 = require("./render");
const parse_1 = require("./parse");
window.addEventListener('load', function () {
    if (releases_1.getCurrentVersion() != releases_1.getLastUsedVersion()) {
        render_1.showReleaseNotification(releases_1.getCurrentVersion());
        releases_1.updateLastUsedVersion();
    }
});
window.runPrettyplan = () => {
    render_1.hideParsingErrorMessage();
    render_1.clearExistingOutput();
    var terraformPlan = document.getElementById("terraform-plan").value;
    var plan = parse_1.parse(terraformPlan);
    if (plan.warnings.length === 0 && plan.actions.length === 0) {
        render_1.displayParsingErrorMessage();
    }
    render_1.render(plan);
    render_1.unHidePlan();
};
window.showReleaseNotes = render_1.showReleaseNotes;
window.expandAll = ui_1.expandAll;
window.collapseAll = ui_1.collapseAll;
window.accordion = ui_1.accordion;
window.closeModal = ui_1.closeModal;
window.hideReleaseNotification = render_1.hideReleaseNotification;
