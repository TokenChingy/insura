import {
  RuleEngineInvalidBetweenValueError,
  RuleEngineInvalidOperatorError,
  RuleEngineInvalidRuleStructureError,
  RuleEngineInvalidSizeTypeError,
  RuleEngineUnsupportedContextTypeError,
} from "../../src/RuleEngine/Models/Error";
import { describe, expect, it } from "bun:test";

import RuleEngine from "../../src/RuleEngine/RuleEngine";
import type { RuleType } from "../../src/RuleEngine/Models/Rule";

/**
 * Test suite for the RuleEngine.
 *
 * @suite
 */
describe("RuleEngine", () => {
  const engine = new RuleEngine();

  /**
   * Test case for evaluating a simple equality rule.
   *
   * @test
   */
  it("should evaluate simple equality rule", () => {
    const context = { age: 25 };
    const rules: RuleType = { fact: "age", operator: "equal", value: 25 };
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(1);
  });

  /**
   * Test case for evaluating nested ALL within ANY rules.
   *
   * @test
   */
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
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(5);
  });

  /**
   * Test case for evaluating nested ANY within ALL rules.
   *
   * @test
   */
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
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(6);
  });

  /**
   * Test case for evaluating top-level ANY rules.
   *
   * @test
   */
  it("should evaluate top-level ANY rules", () => {
    const context = { age: 20, income: 30000, country: "USA" };
    const rules: RuleType = {
      any: [
        { fact: "age", operator: "greaterThan", value: 18 },
        { fact: "income", operator: "greaterThan", value: 50000 },
        { fact: "country", operator: "equal", value: "Canada" },
      ],
    };
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(4);
  });

  /**
   * Test case for evaluating top-level ALL rules.
   *
   * @test
   */
  it("should evaluate top-level ALL rules", () => {
    const context = { age: 30, income: 60000, country: "USA" };
    const rules: RuleType = {
      all: [
        { fact: "age", operator: "greaterThan", value: 18 },
        { fact: "income", operator: "greaterThan", value: 50000 },
        { fact: "country", operator: "equal", value: "USA" },
      ],
    };
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(4);
  });

  /**
   * Test case for evaluating top-level ANY and ALL rules.
   *
   * @test
   */
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
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(7);
  });

  /**
   * Test case for evaluating top-level ANY and ALL rules with nested ANY and ALL rules.
   *
   * @test
   */
  it("should evaluate top-level ANY and ALL rules with nested ANY and ALL rules", () => {
    const context = {
      age: 30,
      income: 40000,
      country: "Canada",
      status: "single",
    };
    const rules: RuleType = {
      all: [
        { fact: "age", operator: "greaterThan", value: 21 },
        { fact: "income", operator: "greaterThan", value: 30000 },
        {
          any: [
            { fact: "age", operator: "greaterThan", value: 25 },
            { fact: "income", operator: "greaterThan", value: 35000 },
          ],
        },
      ],
      any: [
        { fact: "country", operator: "equal", value: "Canada" },
        { fact: "status", operator: "equal", value: "married" },
        {
          all: [
            { fact: "age", operator: "greaterThan", value: 18 },
            { fact: "income", operator: "greaterThan", value: 10000 },
          ],
        },
      ],
    };
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(13);
  });

  /**
   * Test case for invalid between value.
   *
   * @test
   * @throws {RuleEngineInvalidBetweenValueError} If the between value is invalid.
   */
  it("should throw error for invalid between value", () => {
    const context = { age: 25 };
    const rules: RuleType = { fact: "age", operator: "between", value: [18] }; // Invalid between value

    expect(() => engine.evaluateRules(context, rules)).toThrow(
      RuleEngineInvalidBetweenValueError
    );
  });

  /**
   * Test case for invalid operator.
   *
   * @test
   * @throws {RuleEngineInvalidOperatorError} If the operator is invalid.
   */
  it("should throw error for invalid operator", () => {
    const context = { age: 25 };
    const rules: RuleType = {
      fact: "age",
      operator: "invalidOperator" as any,
      value: 25,
    };

    expect(() => engine.evaluateRules(context, rules)).toThrow(
      RuleEngineInvalidOperatorError
    );
  });

  /**
   * Test case for invalid rule structure.
   *
   * @test
   * @throws {RuleEngineInvalidRuleStructureError} If the rule structure is invalid.
   */
  it("should throw error for invalid rule structure", () => {
    const context = { age: 25 };
    const rules: RuleType = { invalidField: "value" } as any;

    expect(() => engine.evaluateRules(context, rules)).toThrow(
      RuleEngineInvalidRuleStructureError
    );
  });

  /**
   * Test case for invalid size type.
   *
   * @test
   * @throws {RuleEngineInvalidSizeTypeError} If the size type is invalid.
   */
  it("should throw error for invalid size type", () => {
    const context = { age: 25 };
    const rules: RuleType = { fact: "age", operator: "size", value: 2 };

    const engine = new RuleEngine();

    expect(() => engine.evaluateRules(context, rules)).toThrow(
      RuleEngineInvalidSizeTypeError
    );
  });

  /**
   * Test case for unsupported context type in comparison.
   *
   * @test
   * @throws {RuleEngineUnsupportedContextTypeError} If the context type is unsupported.
   */
  it("should throw error for unsupported context type in comparison", () => {
    const context = { age: new Map() };
    const rules: RuleType = { fact: "age", operator: "greaterThan", value: 18 };

    expect(() => engine.evaluateRules(context, rules)).toThrow(
      RuleEngineUnsupportedContextTypeError
    );
  });

  /**
   * Test case for evaluating 'in' operator.
   *
   * @test
   */
  it("should evaluate 'in' operator correctly", () => {
    const context = { country: "USA" };
    const rules: RuleType = {
      fact: "country",
      operator: "in",
      value: ["USA", "Canada", "UK"],
    };
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(1);
  });

  /**
   * Test case for evaluating 'contains' operator.
   *
   * @test
   */
  it("should evaluate 'contains' operator correctly", () => {
    const context = { tags: ["premium", "member"] };
    const rules: RuleType = {
      fact: "tags",
      operator: "contains",
      value: "premium",
    };
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(1);
  });

  /**
   * Test case for evaluating 'smaller' operator.
   *
   * @test
   */
  it("should evaluate 'smaller' operator correctly", () => {
    const context = { items: [1, 2, 3] };
    const rules: RuleType = { fact: "items", operator: "smaller", value: 5 };

    const engine = new RuleEngine();
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(1);
  });

  /**
   * Test case for evaluating 'bigger' operator.
   *
   * @test
   */
  it("should evaluate 'bigger' operator correctly", () => {
    const context = { items: [1, 2, 3, 4, 5, 6] };
    const rules: RuleType = { fact: "items", operator: "bigger", value: 5 };

    const engine = new RuleEngine();
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(1);
  });

  /**
   * Test case for evaluating 'withinLast' operator.
   *
   * @test
   */
  it("should evaluate 'withinLast' operator correctly", () => {
    const context = {
      lastLogin: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    }; // 1 hour ago
    const rules: RuleType = {
      fact: "lastLogin",
      operator: "withinLast",
      value: 2 * 60 * 60 * 1000,
    }; // within last 2 hours

    const engine = new RuleEngine();
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(1);
  });

  /**
   * Test case for evaluating 'before' operator.
   *
   * @test
   */
  it("should evaluate 'before' operator correctly", () => {
    const context = { eventDate: "2023-01-01T00:00:00Z" };
    const rules: RuleType = {
      fact: "eventDate",
      operator: "before",
      value: "2024-01-01T00:00:00Z",
    };

    const engine = new RuleEngine();
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(1);
  });

  /**
   * Test case for evaluating 'after' operator.
   *
   * @test
   */
  it("should evaluate 'after' operator correctly", () => {
    const context = { eventDate: "2025-01-01T00:00:00Z" };
    const rules: RuleType = {
      fact: "eventDate",
      operator: "after",
      value: "2024-01-01T00:00:00Z",
    };

    const engine = new RuleEngine();
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(1);
  });

  /**
   * Test case for evaluating 'exists' operator.
   *
   * @test
   */
  it("should evaluate 'exists' operator correctly", () => {
    const context = { name: "John Doe" };
    const rules: RuleType = { fact: "name", operator: "exists", value: null };

    const engine = new RuleEngine();
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(1);
  });

  /**
   * Test case for evaluating 'notExists' operator.
   *
   * @test
   */
  it("should evaluate 'notExists' operator correctly", () => {
    const context = { name: undefined };
    const rules: RuleType = {
      fact: "name",
      operator: "notExists",
      value: null,
    };

    const engine = new RuleEngine();
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(1);
  });

  /**
   * Test case for evaluating 'containsSubstring' operator.
   *
   * @test
   */
  it("should evaluate 'containsSubstring' operator correctly", () => {
    const context = { text: "hello world" };
    const rules: RuleType = {
      fact: "text",
      operator: "containsSubstring",
      value: "world",
    };

    const engine = new RuleEngine();
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(1);
  });

  /**
   * Test case for evaluating 'matches' operator.
   *
   * @test
   */
  it("should evaluate 'matches' operator correctly", () => {
    const context = { text: "hello world" };
    const rules: RuleType = {
      fact: "text",
      operator: "matches",
      value: "^hello.*",
    };

    const engine = new RuleEngine();
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(1);
  });

  /**
   * Test case for evaluating 'isEmpty' operator.
   *
   * @test
   */
  it("should evaluate 'isEmpty' operator correctly", () => {
    const context = { list: [] };
    const rules: RuleType = { fact: "list", operator: "isEmpty", value: null };

    const engine = new RuleEngine();
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(1);
  });

  /**
   * Test case for evaluating 'isNotEmpty' operator.
   *
   * @test
   */
  it("should evaluate 'isNotEmpty' operator correctly", () => {
    const context = { list: [1, 2, 3] };
    const rules: RuleType = {
      fact: "list",
      operator: "isNotEmpty",
      value: null,
    };

    const engine = new RuleEngine();
    const { result, history } = engine.evaluateRules(context, rules);

    expect(result).toBe(true);
    expect(history).toHaveLength(1);
  });

  /**
   * Test case for unsupported context type in 'smaller' operator.
   *
   * @test
   * @throws {RuleEngineInvalidSizeTypeError} If the context type is unsupported for 'smaller'.
   */
  it("should throw error for unsupported context type in 'smaller'", () => {
    const context = { age: 25 };
    const rules: RuleType = { fact: "age", operator: "smaller", value: 3 };

    const engine = new RuleEngine();

    expect(() => engine.evaluateRules(context, rules)).toThrow(
      RuleEngineInvalidSizeTypeError
    );
  });

  /**
   * Test case for unsupported context type in 'bigger' operator.
   *
   * @test
   * @throws {RuleEngineInvalidSizeTypeError} If the context type is unsupported for 'bigger'.
   */
  it("should throw error for unsupported context type in 'bigger'", () => {
    const context = { age: 25 };
    const rules: RuleType = { fact: "age", operator: "bigger", value: 3 };

    const engine = new RuleEngine();

    expect(() => engine.evaluateRules(context, rules)).toThrow(
      RuleEngineInvalidSizeTypeError
    );
  });

  /**
   * Test case for unsupported context type in 'withinLast' operator.
   *
   * @test
   * @throws {RuleEngineUnsupportedContextTypeError} If the context type is unsupported for 'withinLast'.
   */
  it("should throw error for unsupported context type in 'withinLast'", () => {
    const context = { lastLogin: 1234567890 }; // Invalid date type
    const rules: RuleType = {
      fact: "lastLogin",
      operator: "withinLast",
      value: 2 * 60 * 60 * 1000,
    };

    const engine = new RuleEngine();

    expect(() => engine.evaluateRules(context, rules)).toThrow(
      RuleEngineUnsupportedContextTypeError
    );
  });

  /**
   * Test case for unsupported context type in 'before' operator.
   *
   * @test
   * @throws {RuleEngineUnsupportedContextTypeError} If the context type is unsupported for 'before'.
   */
  it("should throw error for unsupported context type in 'before'", () => {
    const context = { eventDate: 1234567890 }; // Invalid date type
    const rules: RuleType = {
      fact: "eventDate",
      operator: "before",
      value: "2024-01-01T00:00:00Z",
    };

    const engine = new RuleEngine();

    expect(() => engine.evaluateRules(context, rules)).toThrow(
      RuleEngineUnsupportedContextTypeError
    );
  });

  /**
   * Test case for unsupported context type in 'after' operator.
   *
   * @test
   * @throws {RuleEngineUnsupportedContextTypeError} If the context type is unsupported for 'after'.
   */
  it("should throw error for unsupported context type in 'after'", () => {
    const context = { eventDate: 1234567890 }; // Invalid date type
    const rules: RuleType = {
      fact: "eventDate",
      operator: "after",
      value: "2024-01-01T00:00:00Z",
    };

    const engine = new RuleEngine();

    expect(() => engine.evaluateRules(context, rules)).toThrow(
      RuleEngineUnsupportedContextTypeError
    );
  });
});
