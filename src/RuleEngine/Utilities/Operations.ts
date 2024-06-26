import {
  RuleEngineInvalidBetweenValueError,
  RuleEngineInvalidSizeTypeError,
  RuleEngineUnsupportedContextTypeError,
} from "../Models/Error";

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
