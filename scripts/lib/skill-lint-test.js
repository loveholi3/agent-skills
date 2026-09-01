"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { lintSkill, lintSkillContent } = require("./skill-lint");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

const sandboxes = [];

function makeSandbox() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "agent-skills-lint-skill-test-"));
  sandboxes.push(root);
  return root;
}

test.afterEach(() => {
  for (const root of sandboxes.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("returns error for unreadable SKILL.md", () => {
  const root = makeSandbox();
  const dirName = "my-skill";
  const skillDir = path.join(root, dirName);
  fs.mkdirSync(skillDir, { recursive: true });
  const skillPath = path.join(skillDir, "SKILL.md");

  // Create a directory named SKILL.md to cause an read error (EISDIR)
  fs.mkdirSync(skillPath);

  const knownSkills = new Set([dirName]);
  const result = lintSkill(dirName, root, knownSkills);

  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /^Unreadable SKILL\.md:/);
  assert.equal(result.warnings.length, 0);
  assert.equal(result.exempt, false);
});

test("returns error for missing SKILL.md", () => {
  const root = makeSandbox();
  const dirName = "my-skill";
  const skillDir = path.join(root, dirName);
  fs.mkdirSync(skillDir, { recursive: true });

  const knownSkills = new Set([dirName]);
  const result = lintSkill(dirName, root, knownSkills);

  assert.equal(result.errors.length, 1);
  assert.equal(result.errors[0], 'Missing SKILL.md');
  assert.equal(result.warnings.length, 0);
  assert.equal(result.exempt, false);
});
