'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { renderProducts } = require('./products');

test('renderProducts correctly renders an empty list', () => {
  const products = [];
  const expected = '<ul></ul>';
  assert.strictEqual(renderProducts(products), expected);
});

test('renderProducts correctly renders a single product', () => {
  const products = [{ id: 1, name: 'Product A', sales: 100 }];
  const expected = '<ul><li data-rank="1">Product A: 100</li></ul>';
  assert.strictEqual(renderProducts(products), expected);
});

test('renderProducts correctly ranks multiple products by sales', () => {
  const products = [
    { id: 1, name: 'Product A', sales: 150 },
    { id: 2, name: 'Product B', sales: 300 },
    { id: 3, name: 'Product C', sales: 50 },
  ];
  const expected =
    '<ul>' +
    '<li data-rank="2">Product A: 150</li>' +
    '<li data-rank="1">Product B: 300</li>' +
    '<li data-rank="3">Product C: 50</li>' +
    '</ul>';
  assert.strictEqual(renderProducts(products), expected);
});

test('renderProducts correctly ranks products with equal sales', () => {
  const products = [
    { id: 1, name: 'Product A', sales: 150 },
    { id: 2, name: 'Product B', sales: 150 },
  ];
  // Since sorting is stable, Product A comes before Product B.
  // Rank of A is 1, Rank of B is 2.
  const expected =
    '<ul>' +
    '<li data-rank="1">Product A: 150</li>' +
    '<li data-rank="2">Product B: 150</li>' +
    '</ul>';
  assert.strictEqual(renderProducts(products), expected);
});
