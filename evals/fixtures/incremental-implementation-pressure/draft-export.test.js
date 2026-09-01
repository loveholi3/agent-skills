'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { exportReports } = require('./draft-export');

test('exportReports successfully creates and downloads a csv', async () => {
  // Save globals
  const originalBlob = global.Blob;
  const originalURLCreateObjectURL = global.URL.createObjectURL;
  const originalDocument = global.document;

  try {
    // Mock globals
    const mockBlob = class {
      constructor(content, options) {
        this.content = content;
        this.options = options;
      }
    };
    global.Blob = mockBlob;

    const mockObjectURL = 'blob:http://localhost/1234';
    global.URL.createObjectURL = test.mock.fn(() => mockObjectURL);

    const mockLink = {
      click: test.mock.fn(),
      remove: test.mock.fn(),
    };

    const mockDocument = {
      createElement: test.mock.fn((tag) => {
        if (tag === 'a') return mockLink;
        return {};
      }),
      body: {
        appendChild: test.mock.fn(),
      },
    };
    global.document = mockDocument;

    const setStatus = test.mock.fn();
    const analytics = {
      track: test.mock.fn(),
    };

    const reports = [
      { name: 'Report 1', total: 10 },
      { name: 'Report 2', total: 20 },
    ];

    await exportReports(reports, setStatus, analytics);

    // Assertions
    assert.strictEqual(setStatus.mock.calls.length, 2);
    assert.strictEqual(setStatus.mock.calls[0].arguments[0], 'working');
    assert.strictEqual(setStatus.mock.calls[1].arguments[0], 'done');

    assert.strictEqual(global.URL.createObjectURL.mock.calls.length, 1);
    const blobArg = global.URL.createObjectURL.mock.calls[0].arguments[0];
    assert.ok(blobArg instanceof mockBlob);
    assert.strictEqual(blobArg.content[0], 'name,total\nReport 1,10\nReport 2,20');
    assert.strictEqual(blobArg.options.type, 'text/csv');

    assert.strictEqual(mockDocument.createElement.mock.calls.length, 1);
    assert.strictEqual(mockDocument.createElement.mock.calls[0].arguments[0], 'a');

    assert.strictEqual(mockLink.href, mockObjectURL);
    assert.strictEqual(mockLink.download, 'reports.csv');

    assert.strictEqual(mockDocument.body.appendChild.mock.calls.length, 1);
    assert.strictEqual(mockDocument.body.appendChild.mock.calls[0].arguments[0], mockLink);

    assert.strictEqual(mockLink.click.mock.calls.length, 1);
    assert.strictEqual(mockLink.remove.mock.calls.length, 1);

    assert.strictEqual(analytics.track.mock.calls.length, 1);
    assert.strictEqual(analytics.track.mock.calls[0].arguments[0], 'report_exported');
    assert.deepEqual(analytics.track.mock.calls[0].arguments[1], { count: 2 });
  } finally {
    // Restore globals
    global.Blob = originalBlob;
    global.URL.createObjectURL = originalURLCreateObjectURL;
    if (originalDocument === undefined) {
      delete global.document;
    } else {
      global.document = originalDocument;
    }
  }
});

test('exportReports handles empty reports', async () => {
  // Save globals
  const originalBlob = global.Blob;
  const originalURLCreateObjectURL = global.URL.createObjectURL;
  const originalDocument = global.document;

  try {
    // Mock globals
    const mockBlob = class {
      constructor(content, options) {
        this.content = content;
        this.options = options;
      }
    };
    global.Blob = mockBlob;

    const mockObjectURL = 'blob:http://localhost/1234';
    global.URL.createObjectURL = test.mock.fn(() => mockObjectURL);

    const mockLink = {
      click: test.mock.fn(),
      remove: test.mock.fn(),
    };

    const mockDocument = {
      createElement: test.mock.fn(() => mockLink),
      body: {
        appendChild: test.mock.fn(),
      },
    };
    global.document = mockDocument;

    const setStatus = test.mock.fn();
    const analytics = {
      track: test.mock.fn(),
    };

    const reports = [];

    await exportReports(reports, setStatus, analytics);

    const blobArg = global.URL.createObjectURL.mock.calls[0].arguments[0];
    assert.strictEqual(blobArg.content[0], 'name,total\n');

    assert.strictEqual(analytics.track.mock.calls[0].arguments[1].count, 0);
  } finally {
    // Restore globals
    global.Blob = originalBlob;
    global.URL.createObjectURL = originalURLCreateObjectURL;
    if (originalDocument === undefined) {
      delete global.document;
    } else {
      global.document = originalDocument;
    }
  }
});
