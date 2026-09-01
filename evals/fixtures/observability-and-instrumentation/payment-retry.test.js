'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { retryPayment } = require('./payment-retry');

test('retryPayment succeeds on first attempt', async () => {
  let chargeCalls = 0;
  const gateway = {
    async charge(payment) {
      chargeCalls++;
      assert.equal(payment, 'test-payment');
      return 'success';
    }
  };

  const result = await retryPayment('test-payment', gateway);
  assert.equal(result, 'success');
  assert.equal(chargeCalls, 1);
});

test('retryPayment succeeds on second attempt', async () => {
  let chargeCalls = 0;
  const gateway = {
    async charge(payment) {
      chargeCalls++;
      if (chargeCalls === 1) {
        throw new Error('network error');
      }
      return 'success';
    }
  };

  // Prevent console.log from cluttering test output, but we can also just let it log.
  // We'll capture it to verify it works as expected.
  const originalLog = console.log;
  const logs = [];
  console.log = (msg) => logs.push(msg);

  try {
    const result = await retryPayment('test-payment', gateway);
    assert.equal(result, 'success');
    assert.equal(chargeCalls, 2);
    assert.deepEqual(logs, ['retry 1 failed: network error']);
  } finally {
    console.log = originalLog;
  }
});

test('retryPayment fails after 3 attempts', async () => {
  let chargeCalls = 0;
  const gateway = {
    async charge(payment) {
      chargeCalls++;
      throw new Error('network error');
    }
  };

  const originalLog = console.log;
  const logs = [];
  console.log = (msg) => logs.push(msg);

  try {
    await assert.rejects(
      async () => retryPayment('test-payment', gateway),
      (err) => {
        assert.equal(err.message, 'payment failed');
        return true;
      }
    );
    assert.equal(chargeCalls, 3);
    assert.deepEqual(logs, [
      'retry 1 failed: network error',
      'retry 2 failed: network error',
      'retry 3 failed: network error'
    ]);
  } finally {
    console.log = originalLog;
  }
});
