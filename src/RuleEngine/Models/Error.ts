import type { Operator } from "./Rule";

/**
 * Error class representing an invalid operator used in the rule engine.
 * @extends {Error}
 */
export class RuleEngineInvalidOperatorError extends Error {
  /**
   * Creates an instance of RuleEngineInvalidOperatorError.
   * @param {Operator} operator - The invalid operator that caused the error.
   */
  constructor(operator: Operator) {
    super(`Invalid operator: ${operator}.`);
    this.name = "RuleEngineInvalidOperatorError";
  }
}

/**
 * Error class representing an invalid fact type for the 'size' operator.
 * @extends {Error}
 */
export class RuleEngineInvalidSizeTypeError extends Error {
  /**
   * Creates an instance of RuleEngineInvalidSizeTypeError.
   */
  constructor() {
    super(`Invalid fact type for 'size' operator. Must be an array or string.`);
    this.name = "RuleEngineInvalidSizeTypeError";
  }
}

/**
 * Error class representing an invalid value for the 'between' operator.
 * @extends {Error}
 */
export class RuleEngineInvalidBetweenValueError extends Error {
  /**
   * Creates an instance of RuleEngineInvalidBetweenValueError.
   */
  constructor() {
    super(
      `Invalid value for 'between' operator. Must be an array of two elements.`
    );
    this.name = "RuleEngineInvalidBetweenValueError";
  }
}

/**
 * Error class representing an unsupported context type for comparison.
 * @extends {Error}
 */
export class RuleEngineUnsupportedContextTypeError extends Error {
  /**
   * Creates an instance of RuleEngineUnsupportedContextTypeError.
   */
  constructor() {
    super(`Unsupported context type for comparison.`);
    this.name = "RuleEngineUnsupportedContextTypeError";
  }
}

/**
 * Error class representing an invalid rule structure.
 * @extends {Error}
 */
export class RuleEngineInvalidRuleStructureError extends Error {
  /**
   * Creates an instance of RuleEngineInvalidRuleStructureError.
   */
  constructor() {
    super(`Invalid rule structure.`);
    this.name = "RuleEngineInvalidRuleStructureError";
  }
}
