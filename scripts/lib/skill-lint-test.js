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
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-skills-lint-skill-test-'));
  sandboxes.push(root);
  return root;
}

afterEach(() => {
  for (const root of sandboxes.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('lintSkill handles unreadable SKILL.md by returning an error', () => {
  const root = makeSandbox();
  const dirName = 'unreadable-skill';
  const skillDir = path.join(root, dirName);
  fs.mkdirSync(skillDir, { recursive: true });
  const skillPath = path.join(skillDir, 'SKILL.md');

  // Make the SKILL.md a directory to force a read error (EISDIR)
  fs.mkdirSync(skillPath);

  const knownSkills = new Set();
  const result = lintSkill(dirName, root, knownSkills);

  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /^Unreadable SKILL\.md: EISDIR:/);
  assert.equal(result.warnings.length, 0);
  assert.equal(result.exempt, false);
});
