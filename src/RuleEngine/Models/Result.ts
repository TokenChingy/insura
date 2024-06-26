import type { RuleType } from "./Rule";

export interface RuleResult {
  rule: RuleType;
  result: boolean;
}

export interface EvaluationResult {
  result: boolean;
  history: RuleResult[];
}
