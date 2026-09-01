'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { retryPayment } = require('./payment-retry');

test('succeeds on first try without retrying', async () => {
  let attempts = 0;
  const gateway = {
    charge: async (payment) => {
      attempts++;
      return 'success';
    }
  };

  const result = await retryPayment('my-payment', gateway);
  assert.equal(result, 'success');
  assert.equal(attempts, 1);
});

test('succeeds on second try', async () => {
  let attempts = 0;
  const gateway = {
    charge: async (payment) => {
      attempts++;
      if (attempts === 1) throw new Error('Network error');
      return 'success';
    }
  };

  const originalLog = console.log;
  let logOutput = [];
  console.log = (msg) => logOutput.push(msg);

  try {
    const result = await retryPayment('my-payment', gateway);
    assert.equal(result, 'success');
    assert.equal(attempts, 2);
    assert.deepEqual(logOutput, ['retry 1 failed: Network error']);
  } finally {
    console.log = originalLog;
  }
});

test('succeeds on third try', async () => {
  let attempts = 0;
  const gateway = {
    charge: async (payment) => {
      attempts++;
      if (attempts < 3) throw new Error('Network error');
      return 'success';
    }
  };

  const originalLog = console.log;
  let logOutput = [];
  console.log = (msg) => logOutput.push(msg);

  try {
    const result = await retryPayment('my-payment', gateway);
    assert.equal(result, 'success');
    assert.equal(attempts, 3);
    assert.deepEqual(logOutput, [
      'retry 1 failed: Network error',
      'retry 2 failed: Network error'
    ]);
  } finally {
    console.log = originalLog;
  }
});

test('fails after 3 attempts', async () => {
  let attempts = 0;
  const gateway = {
    charge: async (payment) => {
      attempts++;
      throw new Error('Fatal error');
    }
  };

  const originalLog = console.log;
  let logOutput = [];
  console.log = (msg) => logOutput.push(msg);

  try {
    await assert.rejects(
      async () => await retryPayment('my-payment', gateway),
      { message: 'payment failed' }
    );
    assert.equal(attempts, 3);
    assert.deepEqual(logOutput, [
      'retry 1 failed: Fatal error',
      'retry 2 failed: Fatal error',
      'retry 3 failed: Fatal error'
    ]);
  } finally {
    console.log = originalLog;
  }
});
