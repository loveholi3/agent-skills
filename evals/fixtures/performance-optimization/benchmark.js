'use strict';

const { performance } = require('node:perf_hooks');
const { renderProducts } = require('./products');

const NUM_PRODUCTS = 1000;
const SALES_MULTIPLIER = 7919;
const SALES_MODULO = 10000;

const products = Array.from({ length: NUM_PRODUCTS }, (_, id) => ({
  id,
  name: `Product ${id}`,
  sales: (id * SALES_MULTIPLIER) % SALES_MODULO,
}));

const start = performance.now();
const output = renderProducts(products);
const elapsed = performance.now() - start;
console.log(JSON.stringify({ products: products.length, bytes: output.length, elapsedMs: elapsed }));
