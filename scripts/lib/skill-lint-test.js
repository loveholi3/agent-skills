#!/usr/bin/env node

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { afterEach, test } = require('node:test');

const { lintSkill } = require('./skill-lint');

const sandboxes = [];

function makeSandbox() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-skills-lint-test-'));
  sandboxes.push(root);
  return root;
}

afterEach(() => {
  for (const root of sandboxes.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('lintSkill returns error when SKILL.md is missing', () => {
  const root = makeSandbox();
  const skillName = 'missing-skill';

  // Create skill directory but no SKILL.md
  fs.mkdirSync(path.join(root, skillName), { recursive: true });

  const knownSkills = new Set([skillName]);
  const result = lintSkill(skillName, root, knownSkills);

  assert.deepEqual(result.errors, ['Missing SKILL.md']);
  assert.deepEqual(result.warnings, []);
  assert.equal(result.exempt, false);
});

test('lintSkill returns error when SKILL.md is unreadable', () => {
  const root = makeSandbox();
  const skillName = 'unreadable-skill';
  const skillDir = path.join(root, skillName);
  const skillPath = path.join(skillDir, 'SKILL.md');

  fs.mkdirSync(skillDir, { recursive: true });
  // To robustly simulate an unreadable file across all platforms/users, create a directory
  // instead of a file so readFileSync throws EISDIR.
  fs.mkdirSync(skillPath);

  const knownSkills = new Set([skillName]);
  const result = lintSkill(skillName, root, knownSkills);

  // Check if it starts with the expected error message prefix
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /^Unreadable SKILL\.md: /);
  assert.deepEqual(result.warnings, []);
  assert.equal(result.exempt, false);
});
