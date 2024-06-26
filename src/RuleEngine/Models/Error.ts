import type { Operator } from "./Rule";

export class RuleEngineInvalidOperatorError extends Error {
  constructor(operator: Operator) {
    super(`Invalid operator: ${operator}.`);
    this.name = "RuleEngineInvalidOperatorError";
  }
}

export class RuleEngineInvalidSizeTypeError extends Error {
  constructor() {
    super(`Invalid fact type for 'size' operator. Must be an array or string.`);
    this.name = "RuleEngineInvalidSizeTypeError";
  }
}

export class RuleEngineInvalidBetweenValueError extends Error {
  constructor() {
    super(
      `Invalid value for 'between' operator. Must be an array of two elements.`
    );
    this.name = "RuleEngineInvalidBetweenValueError";
  }
}

export class RuleEngineUnsupportedContextTypeError extends Error {
  constructor() {
    super(`Unsupported context type for comparison.`);
    this.name = "RuleEngineUnsupportedContextTypeError";
  }
}

export class RuleEngineInvalidRuleStructureError extends Error {
  constructor() {
    super(`Invalid rule structure.`);
    this.name = "RuleEngineInvalidRuleStructureError";
  }
}
