"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function accordion(element) {
    if (element.parentElement) {
        const changes = element.parentElement.getElementsByClassName('changes');
        for (var i = 0; i < changes.length; i++) {
            toggleClass(changes[i], 'collapsed');
        }
    }
}
exports.accordion = accordion;
function toggleClass(element, className) {
    if (!element)
        return;
    if (!element.className.match(className)) {
        element.className += ' ' + className;
    }
    else {
        element.className = element.className.replace(className, '');
    }
}
exports.toggleClass = toggleClass;
function addClass(element, className) {
    if (!element)
        return;
    if (!element.className.match(className))
        element.className += ' ' + className;
}
exports.addClass = addClass;
function removeClass(element, className) {
    if (!element)
        return;
    element.className = element.className.replace(className, '');
}
exports.removeClass = removeClass;
function expandAll() {
    const sections = document.querySelectorAll('.changes.collapsed');
    for (var i = 0; i < sections.length; i++) {
        toggleClass(sections[i], 'collapsed');
    }
    toggleClass(document.querySelector('.expand-all'), 'hidden');
    toggleClass(document.querySelector('.collapse-all'), 'hidden');
}
exports.expandAll = expandAll;
function collapseAll() {
    const sections = document.querySelectorAll('.changes:not(.collapsed)');
    for (var i = 0; i < sections.length; i++) {
        toggleClass(sections[i], 'collapsed');
    }
    toggleClass(document.querySelector('.expand-all'), 'hidden');
    toggleClass(document.querySelector('.collapse-all'), 'hidden');
}
exports.collapseAll = collapseAll;
function removeChildren(element) {
    if (!element)
        return;
    while (element.lastChild) {
        element.removeChild(element.lastChild);
    }
}
exports.removeChildren = removeChildren;
function createModalContainer() {
    const modalElement = document.createElement('div');
    modalElement.id = 'modal-container';
    document.body.appendChild(modalElement);
    return modalElement;
}
exports.createModalContainer = createModalContainer;
function closeModal() {
    const modalElement = document.getElementById('modal-container');
    document.body.removeChild(modalElement);
}
exports.closeModal = closeModal;
