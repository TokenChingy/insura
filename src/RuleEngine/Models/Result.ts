import type { RuleType } from "./Rule";

/**
 * Represents the result of evaluating a single rule.
 * @interface
 */
export interface RuleResult {
  /**
   * The rule that was evaluated.
   * @type {RuleType}
   */
  rule: RuleType;

  /**
   * The result of the rule evaluation.
   * @type {boolean}
   */
  result: boolean;
}

/**
 * Represents the overall result of a rule evaluation process.
 * @interface
 */
export interface EvaluationResult {
  /**
   * The final result of the evaluation process.
   * @type {boolean}
   */
  result: boolean;

  /**
   * The history of rule evaluations, including each rule and its result.
   * @type {RuleResult[]}
   */
  history: RuleResult[];
}
