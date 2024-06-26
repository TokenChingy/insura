import {
  Operations,
  compare,
} from "../../../src/RuleEngine/Utilities/Operations";
import {
  RuleEngineInvalidBetweenValueError,
  RuleEngineInvalidSizeTypeError,
  RuleEngineUnsupportedContextTypeError,
} from "../../../src/RuleEngine/Models/Error";
import { describe, expect, it } from "bun:test";

describe("Operations", () => {
  it("should compare two numbers correctly", () => {
    expect(compare(5, 3)).toBe(2);
    expect(compare(3, 5)).toBe(-2);
    expect(compare(5, 5)).toBe(0);
  });

  it("should compare two strings correctly", () => {
    expect(compare("apple", "banana")).toBeLessThan(0);
    expect(compare("banana", "apple")).toBeGreaterThan(0);
    expect(compare("apple", "apple")).toBe(0);
  });

  it("should compare two dates correctly", () => {
    const date1 = new Date("2024-01-01");
    const date2 = new Date("2023-01-01");
    expect(compare(date1, date2)).toBeGreaterThan(0);
    expect(compare(date2, date1)).toBeLessThan(0);
    expect(compare(date1, date1)).toBe(0);
  });

  it("should throw an error for unsupported context types", () => {
    expect(() => compare(5, "5")).toThrow(
      RuleEngineUnsupportedContextTypeError
    );
    expect(() => compare("apple", 5)).toThrow(
      RuleEngineUnsupportedContextTypeError
    );
    expect(() => compare(new Date(), "2024-01-01")).toThrow(
      RuleEngineUnsupportedContextTypeError
    );
    expect(() => compare({}, {})).toThrow(
      RuleEngineUnsupportedContextTypeError
    );
  });

  it("should evaluate 'equal' correctly", () => {
    expect(Operations.equal(5, 5)).toBe(true);
    expect(Operations.equal("test", "test")).toBe(true);
    expect(Operations.equal(5, 3)).toBe(false);
  });

  it("should evaluate 'notEqual' correctly", () => {
    expect(Operations.notEqual(5, 3)).toBe(true);
    expect(Operations.notEqual("test", "test1")).toBe(true);
    expect(Operations.notEqual(5, 5)).toBe(false);
  });

  it("should evaluate 'greaterThan' correctly", () => {
    expect(Operations.greaterThan(5, 3)).toBe(true);
    expect(Operations.greaterThan(3, 5)).toBe(false);
  });

  it("should evaluate 'lessThan' correctly", () => {
    expect(Operations.lessThan(3, 5)).toBe(true);
    expect(Operations.lessThan(5, 3)).toBe(false);
  });

  it("should evaluate 'greaterThanOrEqual' correctly", () => {
    expect(Operations.greaterThanOrEqual(5, 5)).toBe(true);
    expect(Operations.greaterThanOrEqual(5, 3)).toBe(true);
    expect(Operations.greaterThanOrEqual(3, 5)).toBe(false);
  });

  it("should evaluate 'lessThanOrEqual' correctly", () => {
    expect(Operations.lessThanOrEqual(3, 5)).toBe(true);
    expect(Operations.lessThanOrEqual(5, 5)).toBe(true);
    expect(Operations.lessThanOrEqual(5, 3)).toBe(false);
  });

  it("should evaluate 'in' correctly", () => {
    expect(Operations.in(5, [1, 2, 3, 5])).toBe(true);
    expect(Operations.in(4, [1, 2, 3, 5])).toBe(false);
  });

  it("should evaluate 'notIn' correctly", () => {
    expect(Operations.notIn(4, [1, 2, 3, 5])).toBe(true);
    expect(Operations.notIn(5, [1, 2, 3, 5])).toBe(false);
  });

  it("should evaluate 'contains' correctly", () => {
    expect(Operations.contains([1, 2, 3], 2)).toBe(true);
    expect(Operations.contains([1, 2, 3], 4)).toBe(false);
  });

  it("should evaluate 'startsWith' correctly", () => {
    expect(Operations.startsWith("hello world", "hello")).toBe(true);
    expect(Operations.startsWith("hello world", "world")).toBe(false);
  });

  it("should evaluate 'endsWith' correctly", () => {
    expect(Operations.endsWith("hello world", "world")).toBe(true);
    expect(Operations.endsWith("hello world", "hello")).toBe(false);
  });

  it("should evaluate 'regex' correctly", () => {
    expect(Operations.regex("hello world", "^hello.*")).toBe(true);
    expect(Operations.regex("hello world", "^world.*")).toBe(false);
  });

  it("should evaluate 'between' correctly", () => {
    expect(Operations.between(5, [3, 7])).toBe(true);
    expect(Operations.between(2, [3, 7])).toBe(false);
    expect(() => Operations.between(5, [3])).toThrow(
      RuleEngineInvalidBetweenValueError
    );
  });

  it("should evaluate 'size' correctly", () => {
    expect(Operations.size([1, 2, 3], 3)).toBe(true);
    expect(Operations.size("hello", 5)).toBe(true);
    expect(() => Operations.size(5, 5)).toThrow(RuleEngineInvalidSizeTypeError);
  });

  it("should evaluate 'smaller' correctly", () => {
    expect(Operations.smaller([1, 2], 3)).toBe(true);
    expect(Operations.smaller("hi", 3)).toBe(true);
    expect(() => Operations.smaller(5, 5)).toThrow(
      RuleEngineInvalidSizeTypeError
    );
  });

  it("should evaluate 'bigger' correctly", () => {
    expect(Operations.bigger([1, 2, 3, 4], 3)).toBe(true);
    expect(Operations.bigger("hello", 3)).toBe(true);
    expect(() => Operations.bigger(5, 5)).toThrow(
      RuleEngineInvalidSizeTypeError
    );
  });

  it("should evaluate 'withinLast' correctly", () => {
    const date = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
    expect(Operations.withinLast(date.toISOString(), 2 * 60 * 60 * 1000)).toBe(
      true
    ); // within last 2 hours
    expect(() => Operations.withinLast(1234567890, 2 * 60 * 60 * 1000)).toThrow(
      RuleEngineUnsupportedContextTypeError
    );
  });

  it("should evaluate 'before' correctly", () => {
    const date1 = new Date("2023-01-01T00:00:00Z");
    const date2 = new Date("2024-01-01T00:00:00Z");
    expect(Operations.before(date1.toISOString(), date2.toISOString())).toBe(
      true
    );
    expect(() => Operations.before(1234567890, date2.toISOString())).toThrow(
      RuleEngineUnsupportedContextTypeError
    );
  });

  it("should evaluate 'after' correctly", () => {
    const date1 = new Date("2025-01-01T00:00:00Z");
    const date2 = new Date("2024-01-01T00:00:00Z");
    expect(Operations.after(date1.toISOString(), date2.toISOString())).toBe(
      true
    );
    expect(() => Operations.after(1234567890, date2.toISOString())).toThrow(
      RuleEngineUnsupportedContextTypeError
    );
  });

  it("should evaluate 'exists' correctly", () => {
    expect(Operations.exists("value", null)).toBe(true);
    expect(Operations.exists(undefined, null)).toBe(false);
  });

  it("should evaluate 'notExists' correctly", () => {
    expect(Operations.notExists(undefined, null)).toBe(true);
    expect(Operations.notExists("value", null)).toBe(false);
  });

  it("should evaluate 'containsSubstring' correctly", () => {
    expect(Operations.containsSubstring("hello world", "world")).toBe(true);
    expect(Operations.containsSubstring("hello world", "planet")).toBe(false);
  });

  it("should evaluate 'matches' correctly", () => {
    expect(Operations.matches("hello world", "^hello.*")).toBe(true);
    expect(Operations.matches("hello world", "^world.*")).toBe(false);
  });

  it("should evaluate 'isEmpty' correctly", () => {
    expect(Operations.isEmpty([], null)).toBe(true);
    expect(Operations.isEmpty("hello", null)).toBe(false);
  });

  it("should evaluate 'isNotEmpty' correctly", () => {
    expect(Operations.isNotEmpty([1, 2, 3], null)).toBe(true);
    expect(Operations.isNotEmpty("", null)).toBe(false);
  });
});
