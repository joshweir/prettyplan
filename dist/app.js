/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/ts/prettyplan.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/ts/parse.ts":
/*!*************************!*\
  !*** ./src/ts/parse.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar ChangeType;\n(function (ChangeType) {\n    ChangeType[\"Create\"] = \"create\";\n    ChangeType[\"Read\"] = \"read\";\n    ChangeType[\"Update\"] = \"update\";\n    ChangeType[\"Destroy\"] = \"destroy\";\n    ChangeType[\"Recreate\"] = \"recreate\";\n    ChangeType[\"Unknown\"] = \"unknown\";\n})(ChangeType = exports.ChangeType || (exports.ChangeType = {}));\nfunction parse(terraformPlan) {\n    var warnings = parseWarnings(terraformPlan);\n    var changeSummary = extractChangeSummary(terraformPlan);\n    var changes = extractIndividualChanges(changeSummary);\n    var plan = { warnings: warnings, actions: [] };\n    for (var i = 0; i < changes.length; i++) {\n        plan.actions.push(parseChange(changes[i]));\n    }\n    return plan;\n}\nexports.parse = parse;\nfunction parseWarnings(terraformPlan) {\n    let warningRegex = new RegExp('Warning: (.*:)(.*)', 'gm');\n    let warning;\n    let warnings = [];\n    do {\n        warning = warningRegex.exec(terraformPlan);\n        if (warning) {\n            warnings.push({ id: parseId(warning[1]), detail: warning[2] });\n        }\n    } while (warning);\n    return warnings;\n}\nexports.parseWarnings = parseWarnings;\nfunction extractChangeSummary(terraformPlan) {\n    var beginActionRegex = new RegExp('Terraform will perform the following actions:', 'gm');\n    var begin = beginActionRegex.exec(terraformPlan);\n    if (begin)\n        return terraformPlan.substring(begin.index + 45);\n    else\n        return terraformPlan;\n}\nexports.extractChangeSummary = extractChangeSummary;\nfunction extractIndividualChanges(changeSummary) {\n    //TODO: Fix the '-/' in '-/+' getting chopped off\n    var changeRegex = new RegExp('([~+-]|-\\/\\+|<=) [\\\\S\\\\s]*?((?=-\\/\\+|[~+-] |<=|Plan:)|$)', 'g');\n    var change;\n    var changes = [];\n    do {\n        change = changeRegex.exec(changeSummary);\n        if (change)\n            changes.push(change[0]);\n    } while (change);\n    return changes;\n}\nexports.extractIndividualChanges = extractIndividualChanges;\nfunction parseChange(change) {\n    var changeTypeAndIdRegex = new RegExp('([~+-]|-\\/\\+|<=) (.*)$', 'gm');\n    var changeTypeAndId = changeTypeAndIdRegex.exec(change);\n    var changeTypeSymbol = changeTypeAndId ? changeTypeAndId[1] : '';\n    var resourceId = changeTypeAndId ? changeTypeAndId[2] : '';\n    var type;\n    type = parseChangeSymbol(changeTypeSymbol);\n    //Workaround for recreations showing up as '+' changes\n    if (resourceId.match('(new resource required)')) {\n        type = ChangeType.Recreate;\n        resourceId = resourceId.replace(' (new resource required)', '');\n    }\n    var diffs;\n    if (type === 'create' || type === 'read') {\n        diffs = parseSingleValueDiffs(change);\n    }\n    else {\n        diffs = parseNewAndOldValueDiffs(change);\n    }\n    return {\n        id: parseId(resourceId),\n        type: type,\n        changes: diffs\n    };\n}\nexports.parseChange = parseChange;\nfunction parseId(resourceId) {\n    var idSegments = resourceId.split('.');\n    var resourceName = idSegments[idSegments.length - 1];\n    var resourceType = idSegments[idSegments.length - 2] || null;\n    var resourcePrefixes = idSegments.slice(0, idSegments.length - 2);\n    return { name: resourceName, type: resourceType, prefixes: resourcePrefixes };\n}\nexports.parseId = parseId;\nfunction parseChangeSymbol(changeTypeSymbol) {\n    if (changeTypeSymbol === \"-\")\n        return ChangeType.Destroy;\n    else if (changeTypeSymbol === \"+\")\n        return ChangeType.Create;\n    else if (changeTypeSymbol === \"~\")\n        return ChangeType.Update;\n    else if (changeTypeSymbol === \"<=\")\n        return ChangeType.Read;\n    else if (changeTypeSymbol === \"-/+\")\n        return ChangeType.Recreate;\n    else\n        return ChangeType.Unknown;\n}\nexports.parseChangeSymbol = parseChangeSymbol;\nfunction parseSingleValueDiffs(change) {\n    var propertyAndValueRegex = new RegExp('\\\\s*(.*?): *(?:<computed>|\"(|[\\\\S\\\\s]*?[^\\\\\\\\])\")', 'gm');\n    var diff;\n    var diffs = [];\n    do {\n        diff = propertyAndValueRegex.exec(change);\n        if (diff) {\n            diffs.push({\n                property: diff[1].trim(),\n                new: diff[2] !== undefined ? diff[2] : \"<computed>\"\n            });\n        }\n    } while (diff);\n    return diffs;\n}\nexports.parseSingleValueDiffs = parseSingleValueDiffs;\nfunction parseNewAndOldValueDiffs(change) {\n    var propertyAndNewAndOldValueRegex = new RegExp('\\\\s*(.*?): *(?:\"(|[\\\\S\\\\s]*?[^\\\\\\\\])\")[\\\\S\\\\s]*?=> *(?:<computed>|\"(|[\\\\S\\\\s]*?[^\\\\\\\\])\")( \\\\(forces new resource\\\\))?', 'gm');\n    var diff;\n    var diffs = [];\n    do {\n        diff = propertyAndNewAndOldValueRegex.exec(change);\n        if (diff) {\n            diffs.push({\n                property: diff[1].trim(),\n                old: diff[2],\n                new: diff[3] !== undefined ? diff[3] : \"<computed>\",\n                forcesNewResource: diff[4] !== undefined\n            });\n        }\n    } while (diff);\n    return diffs;\n}\nexports.parseNewAndOldValueDiffs = parseNewAndOldValueDiffs;\n\n\n//# sourceURL=webpack:///./src/ts/parse.ts?");

/***/ }),

/***/ "./src/ts/prettyplan.ts":
/*!******************************!*\
  !*** ./src/ts/prettyplan.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst releases_1 = __webpack_require__(/*! ./releases */ \"./src/ts/releases.ts\");\nconst ui_1 = __webpack_require__(/*! ./ui */ \"./src/ts/ui.ts\");\nconst render_1 = __webpack_require__(/*! ./render */ \"./src/ts/render.ts\");\nconst parse_1 = __webpack_require__(/*! ./parse */ \"./src/ts/parse.ts\");\nwindow.addEventListener('load', function () {\n    if (releases_1.getCurrentVersion() != releases_1.getLastUsedVersion()) {\n        render_1.showReleaseNotification(releases_1.getCurrentVersion());\n        releases_1.updateLastUsedVersion();\n    }\n});\nwindow.runPrettyplan = () => {\n    render_1.hideParsingErrorMessage();\n    render_1.clearExistingOutput();\n    var terraformPlan = document.getElementById(\"terraform-plan\").value;\n    var plan = parse_1.parse(terraformPlan);\n    if (plan.warnings.length === 0 && plan.actions.length === 0) {\n        render_1.displayParsingErrorMessage();\n    }\n    render_1.render(plan);\n    render_1.unHidePlan();\n};\nwindow.showReleaseNotes = render_1.showReleaseNotes;\nwindow.expandAll = ui_1.expandAll;\nwindow.collapseAll = ui_1.collapseAll;\nwindow.accordion = ui_1.accordion;\nwindow.closeModal = ui_1.closeModal;\nwindow.hideReleaseNotification = render_1.hideReleaseNotification;\n\n\n//# sourceURL=webpack:///./src/ts/prettyplan.ts?");

/***/ }),

/***/ "./src/ts/releases.ts":
/*!****************************!*\
  !*** ./src/ts/releases.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nfunction getCurrentVersion() {\n    return releases[0].version;\n}\nexports.getCurrentVersion = getCurrentVersion;\nfunction getLastUsedVersion() {\n    return window.localStorage.getItem('lastUsedVersion') || '';\n}\nexports.getLastUsedVersion = getLastUsedVersion;\nfunction updateLastUsedVersion() {\n    window.localStorage.setItem('lastUsedVersion', getCurrentVersion());\n}\nexports.updateLastUsedVersion = updateLastUsedVersion;\nfunction getReleases() {\n    return releases;\n}\nexports.getReleases = getReleases;\n//New releases should always go at the top of this list.\nlet releases = [\n    {\n        version: 'v1.3',\n        notes: [\n            'A command-line version of Prettyplan is now available! Check it out on <a target=\"_blank\" href=\"https://github.com/chrislewisdev/prettyplan-cli\">GitHub</a>'\n        ]\n    },\n    {\n        version: 'v1.2',\n        notes: [\n            '<em>&lt;computed&gt;</em> values now display properly instead of being interpreted as HTML (<a target=\"_blank\" href=\"https://github.com/chrislewisdev/prettyplan/issues/2\">#2</a>)',\n            'Resource changes with <em>(forces new resource)</em> now have this highlighted in the table of changes (<a target=\"_blank\" href=\"https://github.com/chrislewisdev/prettyplan/issues/3\">#3</a>)',\n            'Italics for <em>&lt;computed&gt;</em> or <em>${variable}</em> values to help set them apart from regular values'\n        ]\n    },\n    {\n        version: 'v1.1',\n        notes: [\n            'Added handy release notes!',\n            'Fixed parsing of large AWS IAM policy documents (<a target=\"_blank\" href=\"https://github.com/chrislewisdev/prettyplan/issues/10\">#10</a>)'\n        ]\n    },\n    {\n        version: 'v1.0',\n        notes: [\n            'See your Terraform plans transformed into a beautiful tabulated format!',\n            'Support for prettyifying JSON content for easier reading',\n            'Theming consistent with the Terraform colour scheme',\n            'Works in Firefox, Chrome, and Edge'\n        ]\n    }\n];\n\n\n//# sourceURL=webpack:///./src/ts/releases.ts?");

/***/ }),

/***/ "./src/ts/render.ts":
/*!**************************!*\
  !*** ./src/ts/render.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nconst ui_1 = __webpack_require__(/*! ./ui */ \"./src/ts/ui.ts\");\nconst releases_1 = __webpack_require__(/*! ./releases */ \"./src/ts/releases.ts\");\nfunction clearExistingOutput() {\n    ui_1.removeChildren(document.getElementById('errors'));\n    ui_1.removeChildren(document.getElementById('warnings'));\n    ui_1.removeChildren(document.getElementById('actions'));\n}\nexports.clearExistingOutput = clearExistingOutput;\nfunction hideParsingErrorMessage() {\n    ui_1.addClass(document.getElementById('parsing-error-message'), 'hidden');\n}\nexports.hideParsingErrorMessage = hideParsingErrorMessage;\nfunction displayParsingErrorMessage() {\n    ui_1.removeClass(document.getElementById('parsing-error-message'), 'hidden');\n}\nexports.displayParsingErrorMessage = displayParsingErrorMessage;\nfunction unHidePlan() {\n    ui_1.removeClass(document.getElementById('prettyplan'), 'hidden');\n}\nexports.unHidePlan = unHidePlan;\nfunction showReleaseNotification(version) {\n    const notificationElement = document.getElementById('release-notification');\n    if (!notificationElement)\n        return;\n    notificationElement.innerHTML = components.releaseNotification(version);\n    ui_1.removeClass(notificationElement, 'hidden');\n}\nexports.showReleaseNotification = showReleaseNotification;\nfunction hideReleaseNotification() {\n    ui_1.addClass(document.getElementById('release-notification'), 'dismissed');\n}\nexports.hideReleaseNotification = hideReleaseNotification;\nfunction showReleaseNotes() {\n    ui_1.createModalContainer().innerHTML = components.modal(components.releaseNotes(releases_1.getReleases()));\n}\nexports.showReleaseNotes = showReleaseNotes;\nfunction render(plan) {\n    if (plan.warnings) {\n        const warningList = document.getElementById('warnings');\n        if (!warningList)\n            return;\n        warningList.innerHTML = plan.warnings.map(components.warning).join('');\n    }\n    if (plan.actions) {\n        const actionList = document.getElementById('actions');\n        if (!actionList)\n            return;\n        actionList.innerHTML = plan.actions.map(components.action).join('');\n    }\n}\nexports.render = render;\nconst components = {\n    badge: (label) => `\n        <span class=\"badge\">${label}</span>\n    `,\n    id: (id) => `\n        <span class=\"id\">\n            ${id.prefixes.map(prefix => `<span class=\"id-segment prefix\">${prefix}</span>`).join('')}\n            <span class=\"id-segment type\">${id.type}</span>\n            <span class=\"id-segment name\">${id.name}</span>\n        </span>\n    `,\n    warning: (warning) => `\n        <li>\n            ${components.badge('warning')}\n            ${components.id(warning.id)}\n            <span>${warning.detail}</span>\n        </li>\n    `,\n    changeCount: (count) => `\n        <span class=\"change-count\">\n            ${count + ' change' + (count > 1 ? 's' : '')}\n        </span>\n    `,\n    change: (change) => `\n        <tr>\n            <td class=\"property\">\n                ${change.property}\n                ${change.forcesNewResource ? `<br /><span class=\"forces-new-resource\">(forces new resource)</span>` : ''}\n            </td>\n            <td class=\"old-value\">${change.old ? prettify(change.old) : ''}</td>\n            <td class=\"new-value\">${prettify(change.new)}</td>\n        </tr>\n    `,\n    action: (action) => `\n        <li class=\"${action.type}\">\n            <div class=\"summary\" onclick=\"accordion(this)\">\n                ${components.badge(action.type)}\n                ${components.id(action.id)}\n                ${action.changes ? components.changeCount(action.changes.length) : ''}\n            </div>\n            <div class=\"changes collapsed\">\n                <table>\n                    ${action.changes.map(components.change).join('')}\n                </table>\n            </div>\n        </li>\n    `,\n    modal: (content) => `\n        <div class=\"modal-pane\" onclick=\"closeModal()\"></div>\n        <div class=\"modal-content\">\n            <div class=\"modal-close\"><button class=\"text-button\" onclick=\"closeModal()\">close</button></div>\n            ${content}\n        </div>\n    `,\n    releaseNotes: (releases) => `\n        <div class=\"release-notes\">\n            <h1>Release Notes</h1>\n            ${releases.map(components.release).join('')}\n        </div>\n    `,\n    release: (release) => `\n        <h2>${release.version}</h2>\n        <ul>\n            ${release.notes.map((note) => `<li>${note}</li>`).join('')}\n        </ul>\n    `,\n    releaseNotification: (version) => `\n        Welcome to ${version}!\n        <button class=\"text-button\" onclick=\"showReleaseNotes(); hideReleaseNotification()\">View release notes?</button>\n        (or <button class=\"text-button\" onclick=\"hideReleaseNotification()\">ignore</button>)\n    `\n};\nfunction prettify(value) {\n    if (value === '<computed>') {\n        return `<em>&lt;computed&gt;</em>`;\n    }\n    else if (value.startsWith('${') && value.endsWith('}')) {\n        return `<em>${value}</em>`;\n    }\n    else if (value.indexOf('\\\\n') >= 0 || value.indexOf('\\\\\"') >= 0) {\n        var sanitisedValue = value.replace(new RegExp('\\\\\\\\n', 'g'), '\\n')\n            .replace(new RegExp('\\\\\\\\\"', 'g'), '\"');\n        return `<pre>${prettifyJson(sanitisedValue)}</pre>`;\n    }\n    else {\n        return value;\n    }\n}\nfunction prettifyJson(maybeJson) {\n    try {\n        return JSON.stringify(JSON.parse(maybeJson), null, 2);\n    }\n    catch (e) {\n        return maybeJson;\n    }\n}\n\n\n//# sourceURL=webpack:///./src/ts/render.ts?");

/***/ }),

/***/ "./src/ts/ui.ts":
/*!**********************!*\
  !*** ./src/ts/ui.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nfunction accordion(element) {\n    if (element.parentElement) {\n        const changes = element.parentElement.getElementsByClassName('changes');\n        for (var i = 0; i < changes.length; i++) {\n            toggleClass(changes[i], 'collapsed');\n        }\n    }\n}\nexports.accordion = accordion;\nfunction toggleClass(element, className) {\n    if (!element)\n        return;\n    if (!element.className.match(className)) {\n        element.className += ' ' + className;\n    }\n    else {\n        element.className = element.className.replace(className, '');\n    }\n}\nexports.toggleClass = toggleClass;\nfunction addClass(element, className) {\n    if (!element)\n        return;\n    if (!element.className.match(className))\n        element.className += ' ' + className;\n}\nexports.addClass = addClass;\nfunction removeClass(element, className) {\n    if (!element)\n        return;\n    element.className = element.className.replace(className, '');\n}\nexports.removeClass = removeClass;\nfunction expandAll() {\n    const sections = document.querySelectorAll('.changes.collapsed');\n    for (var i = 0; i < sections.length; i++) {\n        toggleClass(sections[i], 'collapsed');\n    }\n    toggleClass(document.querySelector('.expand-all'), 'hidden');\n    toggleClass(document.querySelector('.collapse-all'), 'hidden');\n}\nexports.expandAll = expandAll;\nfunction collapseAll() {\n    const sections = document.querySelectorAll('.changes:not(.collapsed)');\n    for (var i = 0; i < sections.length; i++) {\n        toggleClass(sections[i], 'collapsed');\n    }\n    toggleClass(document.querySelector('.expand-all'), 'hidden');\n    toggleClass(document.querySelector('.collapse-all'), 'hidden');\n}\nexports.collapseAll = collapseAll;\nfunction removeChildren(element) {\n    if (!element)\n        return;\n    while (element.lastChild) {\n        element.removeChild(element.lastChild);\n    }\n}\nexports.removeChildren = removeChildren;\nfunction createModalContainer() {\n    const modalElement = document.createElement('div');\n    modalElement.id = 'modal-container';\n    document.body.appendChild(modalElement);\n    return modalElement;\n}\nexports.createModalContainer = createModalContainer;\nfunction closeModal() {\n    const modalElement = document.getElementById('modal-container');\n    document.body.removeChild(modalElement);\n}\nexports.closeModal = closeModal;\n\n\n//# sourceURL=webpack:///./src/ts/ui.ts?");

/***/ })

/******/ });