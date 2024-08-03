import {
  RuleEngineInvalidBetweenValueError,
  RuleEngineInvalidSizeTypeError,
  RuleEngineUnsupportedContextTypeError,
} from "../Models/Error";

/**
 * Compares two values and returns a numeric indication of their relationship.
 *
 * @function
 * @param {any} a - The first value to compare. This can be a number, string, or Date object.
 * @param {any} b - The second value to compare. This can be a number, string, or Date object.
 * @returns {number} Returns a negative number if `a` is less than `b`, zero if they are equal, and a positive number if `a` is greater than `b`.
 * @throws {RuleEngineUnsupportedContextTypeError} If `a` and `b` are not of the same type or not supported types for comparison.
 */
export function compare(a: any, b: any): number {
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  } else if (typeof a === "string" && typeof b === "string") {
    return a.localeCompare(b);
  } else if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  } else {
    throw new RuleEngineUnsupportedContextTypeError();
  }
}

/**
 * A collection of operations for evaluating rules in a rule engine.
 * Each operation is a function that takes a fact value and a rule value as arguments and returns a boolean result.
 *
 * @constant
 * @type {Object}
 *
 * @property {(factValue: any, ruleValue: any) => boolean} equal - Checks if the fact value is equal to the rule value.
 * @property {(factValue: any, ruleValue: any) => boolean} notEqual - Checks if the fact value is not equal to the rule value.
 * @property {(factValue: any, ruleValue: any) => boolean} greaterThan - Checks if the fact value is greater than the rule value.
 * @property {(factValue: any, ruleValue: any) => boolean} lessThan - Checks if the fact value is less than the rule value.
 * @property {(factValue: any, ruleValue: any) => boolean} greaterThanOrEqual - Checks if the fact value is greater than or equal to the rule value.
 * @property {(factValue: any, ruleValue: any) => boolean} lessThanOrEqual - Checks if the fact value is less than or equal to the rule value.
 * @property {(factValue: any, ruleValue: any) => boolean} in - Checks if the fact value is included in the rule value array.
 * @property {(factValue: any, ruleValue: any) => boolean} notIn - Checks if the fact value is not included in the rule value array.
 * @property {(factValue: any, ruleValue: any) => boolean} contains - Checks if the fact value array contains the rule value.
 * @property {(factValue: any, ruleValue: any) => boolean} startsWith - Checks if the fact value string starts with the rule value.
 * @property {(factValue: any, ruleValue: any) => boolean} endsWith - Checks if the fact value string ends with the rule value.
 * @property {(factValue: any, ruleValue: any) => boolean} regex - Checks if the fact value string matches the regular expression rule value.
 * @property {(factValue: any, ruleValue: any) => boolean} between - Checks if the fact value is between the two-element array rule value.
 * @throws {RuleEngineInvalidBetweenValueError} If the rule value is not a two-element array.
 * @property {(factValue: any, ruleValue: any) => boolean} size - Checks if the length of the fact value (string or array) matches the rule value.
 * @throws {RuleEngineInvalidSizeTypeError} If the fact value is not a string or array.
 * @property {(factValue: any, ruleValue: any) => boolean} smaller - Checks if the length of the fact value (string or array) is smaller than the rule value.
 * @throws {RuleEngineInvalidSizeTypeError} If the fact value is not a string or array.
 * @property {(factValue: any, ruleValue: any) => boolean} bigger - Checks if the length of the fact value (string or array) is bigger than the rule value.
 * @throws {RuleEngineInvalidSizeTypeError} If the fact value is not a string or array.
 * @property {(factValue: any, ruleValue: any) => boolean} withinLast - Checks if the fact date is within the last specified period from the current date.
 * @throws {RuleEngineUnsupportedContextTypeError} If the fact value is not a string or Date.
 * @property {(factValue: any, ruleValue: any) => boolean} before - Checks if the fact date is before the rule date.
 * @throws {RuleEngineUnsupportedContextTypeError} If the fact value is not a string or Date.
 * @property {(factValue: any, ruleValue: any) => boolean} after - Checks if the fact date is after the rule date.
 * @throws {RuleEngineUnsupportedContextTypeError} If the fact value is not a string or Date.
 * @property {(factValue: any, ruleValue: any) => boolean} exists - Checks if the fact value is not undefined or null.
 * @property {(factValue: any, ruleValue: any) => boolean} notExists - Checks if the fact value is undefined or null.
 * @property {(factValue: any, ruleValue: any) => boolean} containsSubstring - Checks if the fact value string contains the rule value substring.
 * @property {(factValue: any, ruleValue: any) => boolean} matches - Checks if the fact value string matches the rule value regular expression.
 * @property {(factValue: any, ruleValue: any) => boolean} isEmpty - Checks if the fact value (string or array) is empty.
 * @property {(factValue: any, ruleValue: any) => boolean} isNotEmpty - Checks if the fact value (string or array) is not empty.
 */
export const Operations = {
  equal: (factValue: any, ruleValue: any) => factValue === ruleValue,
  notEqual: (factValue: any, ruleValue: any) => factValue !== ruleValue,
  greaterThan: (factValue: any, ruleValue: any) =>
    compare(factValue, ruleValue) > 0,
  lessThan: (factValue: any, ruleValue: any) =>
    compare(factValue, ruleValue) < 0,
  greaterThanOrEqual: (factValue: any, ruleValue: any) =>
    compare(factValue, ruleValue) >= 0,
  lessThanOrEqual: (factValue: any, ruleValue: any) =>
    compare(factValue, ruleValue) <= 0,
  in: (factValue: any, ruleValue: any) =>
    Array.isArray(ruleValue) && ruleValue.includes(factValue),
  notIn: (factValue: any, ruleValue: any) =>
    Array.isArray(ruleValue) && !ruleValue.includes(factValue),
  contains: (factValue: any, ruleValue: any) =>
    Array.isArray(factValue) && factValue.includes(ruleValue),
  startsWith: (factValue: any, ruleValue: any) =>
    typeof factValue === "string" && factValue.startsWith(ruleValue),
  endsWith: (factValue: any, ruleValue: any) =>
    typeof factValue === "string" && factValue.endsWith(ruleValue),
  regex: (factValue: any, ruleValue: any) =>
    typeof factValue === "string" && new RegExp(ruleValue).test(factValue),
  between: (factValue: any, ruleValue: any) => {
    if (Array.isArray(ruleValue) && ruleValue.length === 2) {
      const [min, max] = ruleValue;

      return compare(factValue, min) >= 0 && compare(factValue, max) <= 0;
    } else {
      throw new RuleEngineInvalidBetweenValueError();
    }
  },
  size: (factValue: any, ruleValue: any) => {
    if (Array.isArray(factValue) || typeof factValue === "string") {
      return factValue.length === ruleValue;
    } else {
      throw new RuleEngineInvalidSizeTypeError();
    }
  },
  smaller: (factValue: any, ruleValue: any) => {
    if (Array.isArray(factValue) || typeof factValue === "string") {
      return factValue.length < ruleValue;
    } else {
      throw new RuleEngineInvalidSizeTypeError();
    }
  },
  bigger: (factValue: any, ruleValue: any) => {
    if (Array.isArray(factValue) || typeof factValue === "string") {
      return factValue.length > ruleValue;
    } else {
      throw new RuleEngineInvalidSizeTypeError();
    }
  },
  withinLast: (factValue: any, ruleValue: any) => {
    if (typeof factValue === "string" || factValue instanceof Date) {
      const now = new Date();
      const factDate = new Date(factValue);
      const diff = now.getTime() - factDate.getTime();

      return diff <= ruleValue;
    } else {
      throw new RuleEngineUnsupportedContextTypeError();
    }
  },
  before: (factValue: any, ruleValue: any) => {
    if (typeof factValue === "string" || factValue instanceof Date) {
      const factDate = new Date(factValue);
      const ruleDate = new Date(ruleValue);

      return factDate.getTime() < ruleDate.getTime();
    } else {
      throw new RuleEngineUnsupportedContextTypeError();
    }
  },
  after: (factValue: any, ruleValue: any) => {
    if (typeof factValue === "string" || factValue instanceof Date) {
      const factDate = new Date(factValue);
      const ruleDate = new Date(ruleValue);

      return factDate.getTime() > ruleDate.getTime();
    } else {
      throw new RuleEngineUnsupportedContextTypeError();
    }
  },
  exists: (factValue: any, ruleValue: any) =>
    factValue !== undefined && factValue !== null,
  notExists: (factValue: any, ruleValue: any) =>
    factValue === undefined || factValue === null,
  containsSubstring: (factValue: any, ruleValue: any) =>
    typeof factValue === "string" &&
    typeof ruleValue === "string" &&
    factValue.includes(ruleValue),
  matches: (factValue: any, ruleValue: any) =>
    typeof factValue === "string" &&
    typeof ruleValue === "string" &&
    new RegExp(ruleValue).test(factValue),
  isEmpty: (factValue: any, ruleValue: any) =>
    (Array.isArray(factValue) || typeof factValue === "string") &&
    factValue.length === 0,
  isNotEmpty: (factValue: any, ruleValue: any) =>
    (Array.isArray(factValue) || typeof factValue === "string") &&
    factValue.length > 0,
};
