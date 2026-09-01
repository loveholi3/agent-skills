"use strict";

const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { mkdtempSync, writeFileSync, rmSync } = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { readManifestVersion, manifestPaths } = require("./validate-versions.js");

test("readManifestVersion extracts version from root level", (t) => {
  const tmpDir = mkdtempSync(path.join(os.tmpdir(), "validate-versions-test-"));
  const manifestPath = path.join(tmpDir, "manifest.json");
  writeFileSync(manifestPath, JSON.stringify({ version: "1.2.3" }));

  t.after(() => rmSync(tmpDir, { recursive: true, force: true }));

  assert.equal(readManifestVersion(manifestPath), "1.2.3");
});

test("readManifestVersion extracts version from plugins array", (t) => {
  const tmpDir = mkdtempSync(path.join(os.tmpdir(), "validate-versions-test-"));
  const manifestPath = path.join(tmpDir, "manifest.json");
  writeFileSync(manifestPath, JSON.stringify({ plugins: [{ version: "2.3.4" }] }));

  t.after(() => rmSync(tmpDir, { recursive: true, force: true }));

  assert.equal(readManifestVersion(manifestPath), "2.3.4");
});

test("readManifestVersion returns undefined when version is missing", (t) => {
  const tmpDir = mkdtempSync(path.join(os.tmpdir(), "validate-versions-test-"));
  const manifestPath = path.join(tmpDir, "manifest.json");
  writeFileSync(manifestPath, JSON.stringify({ name: "no-version" }));

  t.after(() => rmSync(tmpDir, { recursive: true, force: true }));

  assert.equal(readManifestVersion(manifestPath), undefined);
});

test("all plugin manifests use the latest release tag", () => {
  const expectedVersion = execFileSync(
    "git",
    ["describe", "--tags", "--abbrev=0"],
    { encoding: "utf8" },
  ).trim();

  for (const manifestPath of manifestPaths) {
    assert.equal(
      readManifestVersion(manifestPath),
      expectedVersion,
      `${manifestPath} must use version ${expectedVersion}`,
    );
  }
});
