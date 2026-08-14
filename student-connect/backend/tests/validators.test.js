import { test } from "node:test";
import assert from "node:assert";
import { isCollegeEmail } from "../utils/validators.js";

test("accepts a valid VIT Bhopal student email", () => {
  assert.strictEqual(isCollegeEmail("someone@vitbhopal.ac.in"), true);
});

test("accepts a valid VIT student email (Vellore/Chennai/AP shared domain)", () => {
  assert.strictEqual(isCollegeEmail("someone@vitstudent.ac.in"), true);
});

test("rejects a gmail address", () => {
  assert.strictEqual(isCollegeEmail("someone@gmail.com"), false);
});

test("rejects a lookalike domain", () => {
  assert.strictEqual(isCollegeEmail("someone@vitbhopal.ac.in.fake.com"), false);
});

test("rejects malformed input with no @ symbol", () => {
  assert.strictEqual(isCollegeEmail("not-an-email"), false);
});

test("rejects empty or missing email", () => {
  assert.strictEqual(isCollegeEmail(""), false);
  assert.strictEqual(isCollegeEmail(undefined), false);
});

test("domain matching is case-insensitive", () => {
  assert.strictEqual(isCollegeEmail("someone@VITBHOPAL.AC.IN"), true);
});

test("accepts a valid VIT Chennai student email", () => {
  assert.strictEqual(isCollegeEmail("someone@vitchennai.ac.in"), true);
});

test("accepts a valid VIT AP/Amaravati student email", () => {
  assert.strictEqual(isCollegeEmail("someone@vitap.ac.in"), true);
});
