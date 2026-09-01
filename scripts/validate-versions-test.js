"use strict";

const assert = require("node:assert/strict");
const child_process = require("node:child_process");
const fs = require("node:fs");
const test = require("node:test");

const manifestPaths = [
  "plugin.json",
  ".codex-plugin/plugin.json",
  ".claude-plugin/plugin.json",
  ".claude-plugin/marketplace.json",
  ".agents/plugins/marketplace.json",
];

function readManifestVersion(manifestPath) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  return manifest.version ?? manifest.plugins?.[0]?.version;
}

test("readManifestVersion extracts version correctly", (t) => {
  t.mock.method(fs, "readFileSync", (path) => {
    if (path === "top-level.json") return '{"version": "1.0.0"}';
    if (path === "plugin.json") return '{"plugins": [{"version": "2.0.0"}]}';
    return '{}';
  });

  assert.equal(readManifestVersion("top-level.json"), "1.0.0");
  assert.equal(readManifestVersion("plugin.json"), "2.0.0");
  assert.equal(readManifestVersion("empty.json"), undefined);
});

test("all plugin manifests use the latest release tag", () => {
  const expectedVersion = child_process.execFileSync(
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
