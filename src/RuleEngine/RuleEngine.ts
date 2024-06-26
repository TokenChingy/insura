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

export default class RuleEngine implements RuleEnginePort {
  private context: Record<string, unknown> = {};
  private history: RuleResult[] = [];

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

  private evaluateAll(rules: AllRule): boolean {
    const result = rules.all.every((rule) => this.evaluate(rule));

    this.history.push({ rule: rules, result });

    return result;
  }

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

  private evaluateCombined(rules: CombinedRule): boolean {
    const allResult = this.evaluateAll({ all: rules.all });
    const anyResult = this.evaluateAny({ any: rules.any });
    const result = allResult && anyResult;

    this.history.push({ rule: rules, result });

    return result;
  }

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
