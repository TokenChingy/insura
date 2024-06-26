import type {
  AllRule,
  AnyRule,
  CombinedRule,
  RuleType,
} from "../../src/RuleEngine/Models/Rule";
import {
  RuleEngineInvalidBetweenValueError,
  RuleEngineInvalidOperatorError,
  RuleEngineInvalidRuleStructureError,
  RuleEngineInvalidSizeTypeError,
  RuleEngineUnsupportedContextTypeError,
} from "../../src/RuleEngine/Models/Error";
import { describe, expect, it } from "bun:test";

import RuleEngine from "../../src/RuleEngine/RuleEngine";

describe("RuleEngine", () => {
  it("should evaluate simple equality rule", () => {
    const context = { age: 25 };
    const rules: RuleType = { fact: "age", operator: "equal", value: 25 };

    const engine = new RuleEngine();
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(1);
  });

  it("should evaluate nested ALL within ANY rules", () => {
    const context = { age: 25, status: "single", income: 60000 };
    const rules: RuleType = {
      any: [
        {
          all: [
            { fact: "age", operator: "greaterThan", value: 18 },
            { fact: "status", operator: "equal", value: "single" },
          ],
        },
        { fact: "income", operator: "greaterThan", value: 50000 },
      ],
    };

    const engine = new RuleEngine();
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(4);
  });

  it("should evaluate nested ANY within ALL rules", () => {
    const context = {
      age: 30,
      status: "married",
      income: 40000,
      country: "Canada",
    };
    const rules: RuleType = {
      all: [
        {
          any: [
            { fact: "status", operator: "equal", value: "single" },
            { fact: "income", operator: "greaterThan", value: 50000 },
            { fact: "country", operator: "equal", value: "Canada" },
          ],
        },
        { fact: "age", operator: "greaterThan", value: 18 },
      ],
    };

    const engine = new RuleEngine();
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(6);
  });

  it("should evaluate top-level ANY rules", () => {
    const context = { age: 20, income: 30000, country: "USA" };
    const rules: RuleType = {
      any: [
        { fact: "age", operator: "greaterThan", value: 18 },
        { fact: "income", operator: "greaterThan", value: 50000 },
        { fact: "country", operator: "equal", value: "Canada" },
      ],
    };

    const engine = new RuleEngine();
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(2);
  });

  it("should evaluate top-level ALL rules", () => {
    const context = { age: 30, income: 60000, country: "USA" };
    const rules: RuleType = {
      all: [
        { fact: "age", operator: "greaterThan", value: 18 },
        { fact: "income", operator: "greaterThan", value: 50000 },
        { fact: "country", operator: "equal", value: "USA" },
      ],
    };

    const engine = new RuleEngine();
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(4);
  });

  it("should evaluate top-level ANY and ALL rules", () => {
    const context = {
      age: 30,
      income: 40000,
      country: "Canada",
      status: "single",
    };
    const rules: RuleType = {
      all: [
        { fact: "age", operator: "greaterThan", value: 18 },
        { fact: "income", operator: "greaterThan", value: 30000 },
      ],
      any: [
        { fact: "country", operator: "equal", value: "Canada" },
        { fact: "status", operator: "equal", value: "married" },
      ],
    };

    const engine = new RuleEngine();
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(6);
  });

  it("should throw error for invalid between value", () => {
    const context = { age: 25 };
    const rules: RuleType = { fact: "age", operator: "between", value: [18] }; // Invalid between value

    const engine = new RuleEngine();

    expect(() => engine.evaluateRules(context, rules)).toThrow(
      RuleEngineInvalidBetweenValueError
    );
  });

  it("should throw error for invalid operator", () => {
    const context = { age: 25 };
    const rules: RuleType = {
      fact: "age",
      operator: "invalidOperator" as any,
      value: 25,
    };

    const engine = new RuleEngine();

    expect(() => engine.evaluateRules(context, rules)).toThrow(
      RuleEngineInvalidOperatorError
    );
  });

  it("should throw error for invalid rule structure", () => {
    const context = { age: 25 };
    const rules: RuleType = { invalidField: "value" } as any;

    const engine = new RuleEngine();

    expect(() => engine.evaluateRules(context, rules)).toThrow(
      RuleEngineInvalidRuleStructureError
    );
  });

  it("should throw error for invalid size type", () => {
    const context = { age: 25 };
    const rules: RuleType = { fact: "age", operator: "size", value: 2 };

    const engine = new RuleEngine();

    expect(() => engine.evaluateRules(context, rules)).toThrow(
      RuleEngineInvalidSizeTypeError
    );
  });

  it("should throw error for unsupported context type in comparison", () => {
    const context = { age: new Map() };
    const rules: RuleType = { fact: "age", operator: "greaterThan", value: 18 };

    const engine = new RuleEngine();

    expect(() => engine.evaluateRules(context, rules)).toThrow(
      RuleEngineUnsupportedContextTypeError
    );
  });

  it("should evaluate 'in' operator correctly", () => {
    const context = { country: "USA" };
    const rules: RuleType = {
      fact: "country",
      operator: "in",
      value: ["USA", "Canada", "UK"],
    };

    const engine = new RuleEngine();
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(1);
    expect(history[0]).toEqual({ rule: rules, result: true });
  });

  it("should evaluate 'contains' operator correctly", () => {
    const context = { tags: ["premium", "member"] };
    const rules: RuleType = {
      fact: "tags",
      operator: "contains",
      value: "premium",
    };

    const engine = new RuleEngine();
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(1);
    expect(history[0]).toEqual({ rule: rules, result: true });
  });
});
