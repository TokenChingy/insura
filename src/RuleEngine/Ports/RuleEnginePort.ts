import type { EvaluationResult } from "../Models/Result";
import type { RuleType } from "../Models/Rule";

/**
 * Interface for a rule engine that evaluates rules against a given context.
 *
 * @interface
 */
export default interface RuleEnginePort {
  /**
   * Evaluates a set of rules against a provided context and returns the evaluation result.
   *
   * @param {Record<string, unknown>} context - The context in which the rules are evaluated. This is typically an object with various properties that the rules will use for comparison.
   * @param {RuleType} rules - The rules to be evaluated. This can be a single rule or a combination of rules defined by the RuleType.
   * @returns {EvaluationResult} The result of the evaluation, including whether the rules passed and any relevant evaluation history.
   */
  evaluateRules(
    context: Record<string, unknown>,
    rules: RuleType
  ): EvaluationResult;
}
