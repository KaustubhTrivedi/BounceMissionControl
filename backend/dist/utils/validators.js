"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNonEmptyString = exports.isValidSol = exports.isValidDate = void 0;
// Date validation for APOD endpoint
const isValidDate = (dateString) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
        return false;
    }
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
};
exports.isValidDate = isValidDate;
// Sol validation for Mars Rover endpoint
const isValidSol = (solString) => {
    const solNumber = parseInt(solString, 10);
    return !isNaN(solNumber) && solNumber >= 0;
};
exports.isValidSol = isValidSol;
// Generic string validation
const isNonEmptyString = (value) => {
    return typeof value === 'string' && value.trim().length > 0;
};
exports.isNonEmptyString = isNonEmptyString;
