export type Operator =
  | "equal"
  | "notEqual"
  | "greaterThan"
  | "lessThan"
  | "greaterThanOrEqual"
  | "lessThanOrEqual"
  | "in"
  | "contains"
  | "startsWith"
  | "endsWith"
  | "regex"
  | "between"
  | "notIn"
  | "size"
  | "withinLast"
  | "before"
  | "after";

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
