"use strict";

const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { readFileSync } = require("node:fs");
const { afterEach, test } = require("node:test");
const os = require("node:os");
const path = require("node:path");
const fs = require("node:fs");

const { readManifestVersion } = require("./validate-versions.js");

const manifestPaths = [
  "plugin.json",
  ".codex-plugin/plugin.json",
  ".claude-plugin/plugin.json",
  ".claude-plugin/marketplace.json",
  ".agents/plugins/marketplace.json",
];

test("all plugin manifests use the latest release tag", () => {
  let expectedVersion;
  try {
    expectedVersion = execFileSync(
      "git",
      ["describe", "--tags", "--abbrev=0"],
      { encoding: "utf8", stdio: "pipe" },
    ).trim();
  } catch (err) {
    expectedVersion = readManifestVersion(manifestPaths[0]);
  }

  for (const manifestPath of manifestPaths) {
    assert.equal(
      readManifestVersion(manifestPath),
      expectedVersion,
      `${manifestPath} must use version ${expectedVersion}`,
    );
  }
});

const sandboxes = [];

function makeSandbox() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "agent-skills-validate-versions-test-"));
  sandboxes.push(root);
  return root;
}

function writeFile(root, filename, content) {
  const file = path.join(root, filename);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  return file;
}

afterEach(() => {
  for (const root of sandboxes.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("readManifestVersion extracts version from root", () => {
  const root = makeSandbox();
  const file = writeFile(root, "manifest.json", JSON.stringify({ version: "1.2.3" }));
  assert.equal(readManifestVersion(file), "1.2.3");
});

test("readManifestVersion extracts version from plugins[0] if root version is absent", () => {
  const root = makeSandbox();
  const file = writeFile(root, "manifest.json", JSON.stringify({ plugins: [{ version: "2.3.4" }] }));
  assert.equal(readManifestVersion(file), "2.3.4");
});

test("readManifestVersion returns undefined if neither version is present", () => {
  const root = makeSandbox();
  const file = writeFile(root, "manifest.json", JSON.stringify({ plugins: [{}] }));
  assert.equal(readManifestVersion(file), undefined);
});

test("readManifestVersion returns undefined if plugins is not defined and version is absent", () => {
  const root = makeSandbox();
  const file = writeFile(root, "manifest.json", JSON.stringify({ name: "test-plugin" }));
  assert.equal(readManifestVersion(file), undefined);
});
