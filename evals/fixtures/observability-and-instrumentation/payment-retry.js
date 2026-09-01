'use strict';

async function retryPayment(payment, gateway, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await gateway.charge(payment);
    } catch (error) {
      console.log(`retry ${attempt} failed: ${error.message}`);
    }
  }
  throw new Error('payment failed');
}

module.exports = { retryPayment };
