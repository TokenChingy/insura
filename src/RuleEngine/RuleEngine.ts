import type {
  AllRule,
  AnyRule,
  CombinedRule,
  Rule,
  RuleType,
} from "./Models/Rule";
import type { EvaluationResult, RuleResult } from "./Models/Result";
import {
  RuleEngineInvalidBetweenValueError,
  RuleEngineInvalidOperatorError,
  RuleEngineInvalidRuleStructureError,
  RuleEngineInvalidSizeTypeError,
  RuleEngineUnsupportedContextTypeError,
} from "./Models/Error";

import type RuleEnginePort from "./Ports/RuleEnginePort";

export default class RuleEngine implements RuleEnginePort {
  private context: Record<string, unknown> = {};
  private history: RuleResult[] = [];

  private evaluateRule(rule: Rule): boolean {
    const factValue = this.context[rule.fact];
    const ruleValue = rule.value;

    let result: boolean;

    switch (rule.operator) {
      case "equal":
        result = factValue === ruleValue;
        break;
      case "notEqual":
        result = factValue !== ruleValue;
        break;
      case "greaterThan":
        result = this.compare(factValue, ruleValue) > 0;
        break;
      case "lessThan":
        result = this.compare(factValue, ruleValue) < 0;
        break;
      case "greaterThanOrEqual":
        result = this.compare(factValue, ruleValue) >= 0;
        break;
      case "lessThanOrEqual":
        result = this.compare(factValue, ruleValue) <= 0;
        break;
      case "in":
        result = Array.isArray(ruleValue) && ruleValue.includes(factValue);
        break;
      case "notIn":
        result = Array.isArray(ruleValue) && !ruleValue.includes(factValue);
        break;
      case "contains":
        result = Array.isArray(factValue) && factValue.includes(ruleValue);
        break;
      case "startsWith":
        result =
          typeof factValue === "string" && factValue.startsWith(ruleValue);
        break;
      case "endsWith":
        result = typeof factValue === "string" && factValue.endsWith(ruleValue);
        break;
      case "regex":
        result =
          typeof factValue === "string" &&
          new RegExp(ruleValue).test(factValue);
        break;
      case "between":
        if (Array.isArray(ruleValue) && ruleValue.length === 2) {
          const [min, max] = ruleValue;

          result =
            this.compare(factValue, min) >= 0 &&
            this.compare(factValue, max) <= 0;
        } else {
          throw new RuleEngineInvalidBetweenValueError();
        }
        break;
      case "size":
        if (Array.isArray(factValue) || typeof factValue === "string") {
          result = factValue.length === ruleValue;
        } else {
          throw new RuleEngineInvalidSizeTypeError();
        }
        break;
      case "withinLast":
        if (typeof factValue === "string" || factValue instanceof Date) {
          const now = new Date();
          const factDate = new Date(factValue);
          const diff = now.getTime() - factDate.getTime();

          result = diff <= ruleValue;
        } else {
          throw new RuleEngineUnsupportedContextTypeError();
        }
        break;
      case "before":
        if (typeof factValue === "string" || factValue instanceof Date) {
          const factDate = new Date(factValue);
          const ruleDate = new Date(ruleValue);

          result = factDate.getTime() < ruleDate.getTime();
        } else {
          throw new RuleEngineUnsupportedContextTypeError();
        }
        break;
      case "after":
        if (typeof factValue === "string" || factValue instanceof Date) {
          const factDate = new Date(factValue);
          const ruleDate = new Date(ruleValue);

          result = factDate.getTime() > ruleDate.getTime();
        } else {
          throw new RuleEngineUnsupportedContextTypeError();
        }
        break;
      default:
        throw new RuleEngineInvalidOperatorError(rule.operator);
    }

    this.history.push({ rule, result });

    return result;
  }

  private compare(a: any, b: any): number {
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
