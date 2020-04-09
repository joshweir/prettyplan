"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("./ui");
const releases_1 = require("./releases");
function clearExistingOutput() {
    ui_1.removeChildren(document.getElementById('errors'));
    ui_1.removeChildren(document.getElementById('warnings'));
    ui_1.removeChildren(document.getElementById('actions'));
}
exports.clearExistingOutput = clearExistingOutput;
function hideParsingErrorMessage() {
    ui_1.addClass(document.getElementById('parsing-error-message'), 'hidden');
}
exports.hideParsingErrorMessage = hideParsingErrorMessage;
function displayParsingErrorMessage() {
    ui_1.removeClass(document.getElementById('parsing-error-message'), 'hidden');
}
exports.displayParsingErrorMessage = displayParsingErrorMessage;
function unHidePlan() {
    ui_1.removeClass(document.getElementById('prettyplan'), 'hidden');
}
exports.unHidePlan = unHidePlan;
function showReleaseNotification(version) {
    const notificationElement = document.getElementById('release-notification');
    if (!notificationElement)
        return;
    notificationElement.innerHTML = components.releaseNotification(version);
    ui_1.removeClass(notificationElement, 'hidden');
}
exports.showReleaseNotification = showReleaseNotification;
function hideReleaseNotification() {
    ui_1.addClass(document.getElementById('release-notification'), 'dismissed');
}
exports.hideReleaseNotification = hideReleaseNotification;
function showReleaseNotes() {
    ui_1.createModalContainer().innerHTML = components.modal(components.releaseNotes(releases_1.getReleases()));
}
exports.showReleaseNotes = showReleaseNotes;
function render(plan) {
    if (plan.warnings) {
        const warningList = document.getElementById('warnings');
        if (!warningList)
            return;
        warningList.innerHTML = plan.warnings.map(components.warning).join('');
    }
    if (plan.actions) {
        const actionList = document.getElementById('actions');
        if (!actionList)
            return;
        actionList.innerHTML = plan.actions.map(components.action).join('');
    }
}
exports.render = render;
const components = {
    badge: (label) => `
        <span class="badge">${label}</span>
    `,
    id: (id) => `
        <span class="id">
            ${id.prefixes.map(prefix => `<span class="id-segment prefix">${prefix}</span>`).join('')}
            <span class="id-segment type">${id.type}</span>
            <span class="id-segment name">${id.name}</span>
        </span>
    `,
    warning: (warning) => `
        <li>
            ${components.badge('warning')}
            ${components.id(warning.id)}
            <span>${warning.detail}</span>
        </li>
    `,
    changeCount: (count) => `
        <span class="change-count">
            ${count + ' change' + (count > 1 ? 's' : '')}
        </span>
    `,
    change: (change) => `
        <tr>
            <td class="property">
                ${change.property}
                ${change.forcesNewResource ? `<br /><span class="forces-new-resource">(forces new resource)</span>` : ''}
            </td>
            <td class="old-value">${change.old ? prettify(change.old) : ''}</td>
            <td class="new-value">${prettify(change.new)}</td>
        </tr>
    `,
    action: (action) => `
        <li class="${action.type}">
            <div class="summary" onclick="accordion(this)">
                ${components.badge(action.type)}
                ${components.id(action.id)}
                ${action.changes ? components.changeCount(action.changes.length) : ''}
            </div>
            <div class="changes collapsed">
                <table>
                    ${action.changes.map(components.change).join('')}
                </table>
            </div>
        </li>
    `,
    modal: (content) => `
        <div class="modal-pane" onclick="closeModal()"></div>
        <div class="modal-content">
            <div class="modal-close"><button class="text-button" onclick="closeModal()">close</button></div>
            ${content}
        </div>
    `,
    releaseNotes: (releases) => `
        <div class="release-notes">
            <h1>Release Notes</h1>
            ${releases.map(components.release).join('')}
        </div>
    `,
    release: (release) => `
        <h2>${release.version}</h2>
        <ul>
            ${release.notes.map((note) => `<li>${note}</li>`).join('')}
        </ul>
    `,
    releaseNotification: (version) => `
        Welcome to ${version}!
        <button class="text-button" onclick="showReleaseNotes(); hideReleaseNotification()">View release notes?</button>
        (or <button class="text-button" onclick="hideReleaseNotification()">ignore</button>)
    `
};
function prettify(value) {
    if (value === '<computed>') {
        return `<em>&lt;computed&gt;</em>`;
    }
    else if (value.startsWith('${') && value.endsWith('}')) {
        return `<em>${value}</em>`;
    }
    else if (value.indexOf('\\n') >= 0 || value.indexOf('\\"') >= 0) {
        var sanitisedValue = value.replace(new RegExp('\\\\n', 'g'), '\n')
            .replace(new RegExp('\\\\"', 'g'), '"');
        return `<pre>${prettifyJson(sanitisedValue)}</pre>`;
    }
    else {
        return value;
    }
}
function prettifyJson(maybeJson) {
    try {
        return JSON.stringify(JSON.parse(maybeJson), null, 2);
    }
    catch (e) {
        return maybeJson;
    }
}
