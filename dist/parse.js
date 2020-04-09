"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChangeType;
(function (ChangeType) {
    ChangeType["Create"] = "create";
    ChangeType["Read"] = "read";
    ChangeType["Update"] = "update";
    ChangeType["Destroy"] = "destroy";
    ChangeType["Recreate"] = "recreate";
    ChangeType["Unknown"] = "unknown";
})(ChangeType = exports.ChangeType || (exports.ChangeType = {}));
function parse(terraformPlan) {
    var warnings = parseWarnings(terraformPlan);
    var changeSummary = extractChangeSummary(terraformPlan);
    var changes = extractIndividualChanges(changeSummary);
    var plan = { warnings: warnings, actions: [] };
    for (var i = 0; i < changes.length; i++) {
        plan.actions.push(parseChange(changes[i]));
    }
    return plan;
}
exports.parse = parse;
function parseWarnings(terraformPlan) {
    let warningRegex = new RegExp('Warning: (.*:)(.*)', 'gm');
    let warning;
    let warnings = [];
    do {
        warning = warningRegex.exec(terraformPlan);
        if (warning) {
            warnings.push({ id: parseId(warning[1]), detail: warning[2] });
        }
    } while (warning);
    return warnings;
}
exports.parseWarnings = parseWarnings;
function extractChangeSummary(terraformPlan) {
    var beginActionRegex = new RegExp('Terraform will perform the following actions:', 'gm');
    var begin = beginActionRegex.exec(terraformPlan);
    if (begin)
        return terraformPlan.substring(begin.index + 45);
    else
        return terraformPlan;
}
exports.extractChangeSummary = extractChangeSummary;
function extractIndividualChanges(changeSummary) {
    //TODO: Fix the '-/' in '-/+' getting chopped off
    var changeRegex = new RegExp('([~+-]|-\/\+|<=) [\\S\\s]*?((?=-\/\+|[~+-] |<=|Plan:)|$)', 'g');
    var change;
    var changes = [];
    do {
        change = changeRegex.exec(changeSummary);
        if (change)
            changes.push(change[0]);
    } while (change);
    return changes;
}
exports.extractIndividualChanges = extractIndividualChanges;
function parseChange(change) {
    var changeTypeAndIdRegex = new RegExp('([~+-]|-\/\+|<=) (.*)$', 'gm');
    var changeTypeAndId = changeTypeAndIdRegex.exec(change);
    var changeTypeSymbol = changeTypeAndId ? changeTypeAndId[1] : '';
    var resourceId = changeTypeAndId ? changeTypeAndId[2] : '';
    var type;
    type = parseChangeSymbol(changeTypeSymbol);
    //Workaround for recreations showing up as '+' changes
    if (resourceId.match('(new resource required)')) {
        type = ChangeType.Recreate;
        resourceId = resourceId.replace(' (new resource required)', '');
    }
    var diffs;
    if (type === 'create' || type === 'read') {
        diffs = parseSingleValueDiffs(change);
    }
    else {
        diffs = parseNewAndOldValueDiffs(change);
    }
    return {
        id: parseId(resourceId),
        type: type,
        changes: diffs
    };
}
exports.parseChange = parseChange;
function parseId(resourceId) {
    var idSegments = resourceId.split('.');
    var resourceName = idSegments[idSegments.length - 1];
    var resourceType = idSegments[idSegments.length - 2] || null;
    var resourcePrefixes = idSegments.slice(0, idSegments.length - 2);
    return { name: resourceName, type: resourceType, prefixes: resourcePrefixes };
}
exports.parseId = parseId;
function parseChangeSymbol(changeTypeSymbol) {
    if (changeTypeSymbol === "-")
        return ChangeType.Destroy;
    else if (changeTypeSymbol === "+")
        return ChangeType.Create;
    else if (changeTypeSymbol === "~")
        return ChangeType.Update;
    else if (changeTypeSymbol === "<=")
        return ChangeType.Read;
    else if (changeTypeSymbol === "-/+")
        return ChangeType.Recreate;
    else
        return ChangeType.Unknown;
}
exports.parseChangeSymbol = parseChangeSymbol;
function parseSingleValueDiffs(change) {
    var propertyAndValueRegex = new RegExp('\\s*(.*?): *(?:<computed>|"(|[\\S\\s]*?[^\\\\])")', 'gm');
    var diff;
    var diffs = [];
    do {
        diff = propertyAndValueRegex.exec(change);
        if (diff) {
            diffs.push({
                property: diff[1].trim(),
                new: diff[2] !== undefined ? diff[2] : "<computed>"
            });
        }
    } while (diff);
    return diffs;
}
exports.parseSingleValueDiffs = parseSingleValueDiffs;
function parseNewAndOldValueDiffs(change) {
    var propertyAndNewAndOldValueRegex = new RegExp('\\s*(.*?): *(?:"(|[\\S\\s]*?[^\\\\])")[\\S\\s]*?=> *(?:<computed>|"(|[\\S\\s]*?[^\\\\])")( \\(forces new resource\\))?', 'gm');
    var diff;
    var diffs = [];
    do {
        diff = propertyAndNewAndOldValueRegex.exec(change);
        if (diff) {
            diffs.push({
                property: diff[1].trim(),
                old: diff[2],
                new: diff[3] !== undefined ? diff[3] : "<computed>",
                forcesNewResource: diff[4] !== undefined
            });
        }
    } while (diff);
    return diffs;
}
exports.parseNewAndOldValueDiffs = parseNewAndOldValueDiffs;
