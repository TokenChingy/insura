// benchmark-api-access.ts

import Benchmark from "benchmark";
import RuleEngine from "../src/RuleEngine/RuleEngine";
import type { RuleType } from "../src/RuleEngine/Models/Rule";

/**
 * A simple context representing a basic user profile with minimal attributes.
 * @constant
 * @type {Object}
 * @property {string} role - The role of the user.
 * @property {number} age - The age of the user.
 * @property {string} location - The location of the user.
 */
const simpleContext = { role: "user", age: 25, location: "USA" };

/**
 * Simple rules for evaluating access based on age and location.
 * @constant
 * @type {RuleType}
 */
const simpleRules: RuleType = {
  any: [
    { fact: "age", operator: "greaterThan", value: 18 },
    { fact: "location", operator: "equal", value: "USA" },
  ],
};

/**
 * A complex context representing an admin user with detailed attributes.
 * @constant
 * @type {Object}
 * @property {string} role - The role of the user.
 * @property {number} age - The age of the user.
 * @property {string} subscription - The subscription level of the user.
 * @property {string} location - The location of the user.
 * @property {string[]} actions - The actions the user is allowed to perform.
 */
const complexContext = {
  role: "admin",
  age: 30,
  subscription: "premium",
  location: "USA",
  actions: ["manage_users", "access_reports", "edit_settings"],
};

/**
 * Complex rules for evaluating access based on role, subscription, and actions.
 * @constant
 * @type {RuleType}
 */
const complexRules: RuleType = {
  all: [
    { fact: "role", operator: "equal", value: "admin" },
    { fact: "subscription", operator: "equal", value: "premium" },
    { fact: "actions", operator: "contains", value: "manage_users" },
  ],
};

/**
 * A large context simulating a dataset of 1,000 users with various attributes.
 * @constant
 * @type {Object}
 * @property {Array<Object>} users - An array of user objects with attributes like age, role, subscription, lastLogin, and actions.
 */
const largeContext = {
  users: Array.from({ length: 1000 }, (_, i) => ({
    age: i + 20,
    role: i % 2 === 0 ? "admin" : "user",
    subscription: i % 3 === 0 ? "enterprise" : "standard",
    lastLogin: new Date(Date.now() - i * 1000 * 60).toISOString(),
    actions: ["view_content", "edit_content"],
  })),
};

/**
 * Large rules for evaluating access based on user count and specific user criteria.
 * @constant
 * @type {RuleType}
 */
const largeRules: RuleType = {
  any: [
    {
      all: [
        { fact: "users", operator: "size", value: 1000 },
        {
          fact: "users",
          operator: "contains",
          value: { age: 500, role: "admin", subscription: "enterprise" },
        },
      ],
    },
  ],
};

/**
 * An extremely large context simulating a dataset of 10,000 accounts with complex attributes.
 * @constant
 * @type {Object}
 * @property {Array<Object>} accounts - An array of account objects with attributes like id, age, location, subscription, lastLogin, and permissions.
 */
const extremelyLargeContext = {
  accounts: Array.from({ length: 10000 }, (_, i) => ({
    id: i + 1,
    age: Math.floor(Math.random() * 80) + 18,
    location: `Country_${i % 10}`,
    subscription: i % 5 === 0 ? "premium" : "basic",
    lastLogin: new Date(Date.now() - i * 1000 * 60).toISOString(),
    permissions: i % 2 === 0 ? ["read", "write", "execute"] : ["read"],
  })),
};

/**
 * Extremely large rules for evaluating access based on account count, age, location, subscription, and permissions.
 * @constant
 * @type {RuleType}
 */
const extremelyLargeRules: RuleType = {
  all: [
    { fact: "accounts", operator: "size", value: 10000 },
    {
      any: [
        {
          all: [
            {
              fact: "accounts",
              operator: "contains",
              value: { age: 65, location: "Country_3" },
            },
            {
              fact: "accounts",
              operator: "contains",
              value: { subscription: "premium" },
            },
          ],
        },
        {
          fact: "accounts",
          operator: "contains",
          value: { id: 7500, permissions: ["read", "write", "execute"] },
        },
      ],
    },
  ],
};

// Initialize RuleEngine
const engine = new RuleEngine();

/**
 * Benchmark Suite for evaluating the performance of the RuleEngine with varying complexity contexts.
 * @function
 */
const suite = new Benchmark.Suite();

suite
  .add("Simple Context Evaluation", () => {
    engine.evaluateRules(simpleContext, simpleRules);
  })
  .add("Complex Context Evaluation", () => {
    engine.evaluateRules(complexContext, complexRules);
  })
  .add("Large Context Evaluation", () => {
    engine.evaluateRules(largeContext, largeRules);
  })
  .add("Extremely Large Context Evaluation", () => {
    engine.evaluateRules(extremelyLargeContext, extremelyLargeRules);
  })
  .on("cycle", (event: any) => {
    console.log(String(event.target));
  })
  .on("complete", function (this: Benchmark.Suite) {
    console.log(`Fastest is ${this.filter("fastest").map("name")}`);
  })
  .run({ async: true });
