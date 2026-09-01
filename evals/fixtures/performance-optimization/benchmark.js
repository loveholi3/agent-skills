'use strict';

const { performance } = require('node:perf_hooks');
const { renderProducts } = require('./products');

const PRODUCT_COUNT = 1000;
const PRNG_MULTIPLIER = 7919;
const PRNG_MODULO = 10000;

const products = Array.from({ length: PRODUCT_COUNT }, (_, id) => ({
  id,
  name: `Product ${id}`,
  sales: (id * PRNG_MULTIPLIER) % PRNG_MODULO,
}));

const start = performance.now();
const output = renderProducts(products);
const elapsed = performance.now() - start;
console.log(JSON.stringify({ products: products.length, bytes: output.length, elapsedMs: elapsed }));
