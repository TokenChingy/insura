import type { EvaluationResult } from "../Models/Result";
import type { RuleType } from "../Models/Rule";

export default interface RuleEnginePort {
  evaluateRules(
    context: Record<string, unknown>,
    rules: RuleType
  ): EvaluationResult;
}
