'use strict';

const { performance } = require('node:perf_hooks');
const { renderProducts } = require('./products');

const PRODUCT_COUNT = 1000;
const SEED_MULTIPLIER = 7919;
const SEED_MODULUS = 10000;

// Replaced magic numbers with named constants for clarity
const products = Array.from({ length: PRODUCT_COUNT }, (_, id) => ({
  id,
  name: `Product ${id}`,
  sales: (id * SEED_MULTIPLIER) % SEED_MODULUS,
}));

const start = performance.now();
const output = renderProducts(products);
const elapsed = performance.now() - start;
console.log(JSON.stringify({ products: products.length, bytes: output.length, elapsedMs: elapsed }));
