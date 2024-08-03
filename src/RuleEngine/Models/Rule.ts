/**
 * Represents an operator used in a rule.
 *
 * @typedef {("equal" | "notEqual" | "greaterThan" | "lessThan" | "greaterThanOrEqual" | "lessThanOrEqual" | "in" | "notIn" | "contains" | "startsWith" | "endsWith" | "regex" | "between" | "count" | "size" | "smaller" | "bigger" | "withinLast" | "before" | "after" | "exists" | "notExists" | "containsSubstring" | "matches" | "isEmpty" | "isNotEmpty")} Operator
 *
 * @description An Operator defines the comparison logic for evaluating rules.
 * It includes various comparison and matching operators, such as equality checks,
 * range checks, and substring checks.
 */
export type Operator =
  | "equal"
  | "notEqual"
  | "greaterThan"
  | "lessThan"
  | "greaterThanOrEqual"
  | "lessThanOrEqual"
  | "in"
  | "notIn"
  | "contains"
  | "startsWith"
  | "endsWith"
  | "regex"
  | "between"
  | "count"
  | "size"
  | "smaller"
  | "bigger"
  | "withinLast"
  | "before"
  | "after"
  | "exists"
  | "notExists"
  | "containsSubstring"
  | "matches"
  | "isEmpty"
  | "isNotEmpty";

/**
 * Represents a basic rule that can be evaluated.
 *
 * @interface
 *
 * @property {string} fact - The name of the fact that the rule evaluates.
 * @property {Operator} operator - The operator used to evaluate the fact.
 * @property {any} value - The value to compare the fact against.
 */
export interface Rule {
  fact: string;
  operator: Operator;
  value: any;
}

/**
 * Represents a rule set where all contained rules must be true.
 *
 * @interface
 *
 * @property {RuleType[]} all - An array of rules that all must evaluate to true.
 */
export interface AllRule {
  all: RuleType[];
}

/**
 * Represents a rule set where any contained rule must be true.
 *
 * @interface
 *
 * @property {RuleType[]} any - An array of rules where at least one must evaluate to true.
 */
export interface AnyRule {
  any: RuleType[];
}

/**
 * Represents a complex rule with both 'all' and 'any' conditions.
 *
 * @interface
 *
 * @property {RuleType[]} all - An array of rules where all must evaluate to true.
 * @property {RuleType[]} any - An array of rules where at least one must evaluate to true.
 */
export interface CombinedRule {
  all: RuleType[];
  any: RuleType[];
}

/**
 * Defines the types of rules that can be used in a rule engine.
 *
 * @typedef {Rule | AllRule | AnyRule | CombinedRule} RuleType
 */
export type RuleType = Rule | AllRule | AnyRule | CombinedRule;
