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

export interface Rule {
  fact: string;
  operator: Operator;
  value: any;
}

export interface AllRule {
  all: RuleType[];
}

export interface AnyRule {
  any: RuleType[];
}

export interface CombinedRule {
  all: RuleType[];
  any: RuleType[];
}

export type RuleType = Rule | AllRule | AnyRule | CombinedRule;
