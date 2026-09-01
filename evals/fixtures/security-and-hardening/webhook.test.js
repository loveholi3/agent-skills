'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { previewWebhook } = require('./webhook');

test('returns a bounded preview from a successful request', async () => {
  const result = await previewWebhook('https://example.com/hook', async () => ({
    status: 200,
    text: async () => 'ok',
  }));
  assert.deepEqual(result, { status: 200, body: 'ok' });
});

test('prevents SSRF by not following redirects', async () => {
  let calledOptions;
  await previewWebhook('https://example.com/hook', async (url, options) => {
    calledOptions = options;
    return {
      status: 200,
      text: async () => 'ok',
    };
  });
  assert.equal(calledOptions.redirect, 'error');
});
