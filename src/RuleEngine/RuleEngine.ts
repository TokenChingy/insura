import type {
  AllRule,
  AnyRule,
  CombinedRule,
  Rule,
  RuleType,
} from "./Models/Rule";
import type { EvaluationResult, RuleResult } from "./Models/Result";
import {
  RuleEngineInvalidOperatorError,
  RuleEngineInvalidRuleStructureError,
} from "./Models/Error";

import { Operations } from "./Utilities/Operations";
import type RuleEnginePort from "./Ports/RuleEnginePort";

/**
 * Class representing a rule engine that evaluates rules against a context.
 * Implements the RuleEnginePort interface.
 *
 * @class
 * @implements {RuleEnginePort}
 */
export default class RuleEngine implements RuleEnginePort {
  /**
   * The context in which rules are evaluated.
   *
   * @private
   * @type {Record<string, unknown>}
   */
  private context: Record<string, unknown> = {};

  /**
   * The history of evaluated rules and their results.
   *
   * @private
   * @type {RuleResult[]}
   */
  private history: RuleResult[] = [];

  /**
   * Evaluates a single rule against the current context.
   *
   * @private
   * @param {Rule} rule - The rule to evaluate.
   * @returns {boolean} The result of the rule evaluation.
   * @throws {RuleEngineInvalidOperatorError} If the rule contains an invalid operator.
   */
  private evaluateRule(rule: Rule): boolean {
    const factValue = this.context[rule.fact];
    const ruleValue = rule.value;

    const operatorFunction =
      Operations[rule.operator as keyof typeof Operations];

    if (!operatorFunction) {
      throw new RuleEngineInvalidOperatorError(rule.operator);
    }

    const result = operatorFunction(factValue, ruleValue);

    this.history.push({ rule, result });

    return result;
  }

  /**
   * Evaluates an AllRule, which requires all contained rules to be true.
   *
   * @private
   * @param {AllRule} rules - The AllRule to evaluate.
   * @returns {boolean} True if all rules are true, otherwise false.
   */
  private evaluateAll(rules: AllRule): boolean {
    const result = rules.all.every((rule) => this.evaluate(rule));

    this.history.push({ rule: rules, result });

    return result;
  }

  /**
   * Evaluates an AnyRule, which requires at least one contained rule to be true.
   *
   * @private
   * @param {AnyRule} rules - The AnyRule to evaluate.
   * @returns {boolean} True if at least one rule is true, otherwise false.
   */
  private evaluateAny(rules: AnyRule): boolean {
    let result = false;

    for (const rule of rules.any) {
      if (this.evaluate(rule)) {
        result = true;
      }
    }

    this.history.push({ rule: rules, result });

    return result;
  }

  /**
   * Evaluates a CombinedRule, which requires all rules in 'all' and at least one rule in 'any' to be true.
   *
   * @private
   * @param {CombinedRule} rules - The CombinedRule to evaluate.
   * @returns {boolean} True if all conditions are met, otherwise false.
   */
  private evaluateCombined(rules: CombinedRule): boolean {
    const allResult = this.evaluateAll({ all: rules.all });
    const anyResult = this.evaluateAny({ any: rules.any });
    const result = allResult && anyResult;

    this.history.push({ rule: rules, result });

    return result;
  }

  /**
   * Evaluates a rule of any type by determining its structure and applying the appropriate evaluation method.
   *
   * @private
   * @param {RuleType} rule - The rule to evaluate.
   * @returns {boolean} The result of the evaluation.
   * @throws {RuleEngineInvalidRuleStructureError} If the rule structure is invalid.
   */
  private evaluate(rule: RuleType): boolean {
    if ("fact" in rule) {
      return this.evaluateRule(rule as Rule);
    } else if ("all" in rule && "any" in rule) {
      return this.evaluateCombined(rule as CombinedRule);
    } else if ("all" in rule) {
      return this.evaluateAll(rule as AllRule);
    } else if ("any" in rule) {
      return this.evaluateAny(rule as AnyRule);
    } else {
      throw new RuleEngineInvalidRuleStructureError();
    }
  }

  /**
   * Evaluates rules against a given context and returns the evaluation result along with the evaluation history.
   *
   * @param {Record<string, unknown>} context - The context in which to evaluate the rules.
   * @param {RuleType} rules - The rules to evaluate.
   * @returns {EvaluationResult} The result of the evaluation, including a history of all evaluated rules.
   */
  public evaluateRules(
    context: Record<string, unknown>,
    rules: RuleType
  ): EvaluationResult {
    this.context = context;
    this.history = [];

    return {
      result: this.evaluate(rules),
      history: this.history,
    };
  }
}
