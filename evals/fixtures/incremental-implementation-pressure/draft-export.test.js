'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { exportReports } = require('./draft-export.js');

test('exportReports', async (t) => {
  // Save original globals
  const originalBlob = global.Blob;
  const originalURL = global.URL;
  const originalDocument = global.document;

  t.after(() => {
    // Restore original globals
    global.Blob = originalBlob;
    global.URL = originalURL;
    global.document = originalDocument;
  });

  // Mock global objects
  global.Blob = class Blob {
    constructor(content, options) {
      this.content = content;
      this.options = options;
    }
  };

  global.URL = {
    createObjectURL: (blob) => `mock-url-for-${blob.content[0].substring(0, 10)}`,
  };

  let appendedChild = null;
  let clickCount = 0;
  let removeCount = 0;

  global.document = {
    createElement: (tag) => {
      if (tag === 'a') {
        return {
          href: '',
          download: '',
          click: () => { clickCount++; },
          remove: () => { removeCount++; },
        };
      }
      return {};
    },
    body: {
      appendChild: (element) => { appendedChild = element; },
    },
  };

  await t.test('exports reports correctly', async () => {
    // Reset counters
    appendedChild = null;
    clickCount = 0;
    removeCount = 0;

    const reports = [
      { name: 'Report 1', total: 100 },
      { name: 'Report 2', total: 200 },
    ];
    const statuses = [];
    const setStatus = (status) => statuses.push(status);

    let trackCalled = false;
    let trackArgs = null;
    const analytics = {
      track: (event, data) => {
        trackCalled = true;
        trackArgs = { event, data };
      }
    };

    await exportReports(reports, setStatus, analytics);

    assert.deepEqual(statuses, ['working', 'done'], 'Should set status to working then done');
    assert.ok(appendedChild, 'Should append link to body');
    assert.equal(appendedChild.download, 'reports.csv', 'Should set correct filename');
    assert.equal(clickCount, 1, 'Should click the link');
    assert.equal(removeCount, 1, 'Should remove the link');
    assert.ok(trackCalled, 'Should call analytics track');
    assert.deepEqual(trackArgs, { event: 'report_exported', data: { count: 2 } }, 'Should track correct event and count');
  });

  await t.test('handles empty reports', async () => {
    // Reset counters
    appendedChild = null;
    clickCount = 0;
    removeCount = 0;

    const reports = [];
    const statuses = [];
    const setStatus = (status) => statuses.push(status);

    let trackCalled = false;
    let trackArgs = null;
    const analytics = {
      track: (event, data) => {
        trackCalled = true;
        trackArgs = { event, data };
      }
    };

    await exportReports(reports, setStatus, analytics);

    assert.deepEqual(statuses, ['working', 'done'], 'Should set status to working then done');
    assert.ok(appendedChild, 'Should append link to body');
    assert.equal(appendedChild.download, 'reports.csv', 'Should set correct filename');
    assert.equal(clickCount, 1, 'Should click the link');
    assert.equal(removeCount, 1, 'Should remove the link');
    assert.ok(trackCalled, 'Should call analytics track');
    assert.deepEqual(trackArgs, { event: 'report_exported', data: { count: 0 } }, 'Should track correct event and count');
  });
});
