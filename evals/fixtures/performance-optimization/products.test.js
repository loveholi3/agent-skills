'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { renderProducts } = require('./products');

test('renders an empty list of products', () => {
  const result = renderProducts([]);
  assert.equal(result, '<ul></ul>');
});

test('renders products sorted by sales with correct ranks', () => {
  const products = [
    { id: 1, name: 'Apple', sales: 50 },
    { id: 2, name: 'Banana', sales: 100 },
    { id: 3, name: 'Cherry', sales: 25 },
  ];
  const result = renderProducts(products);
  assert.equal(
    result,
    '<ul><li data-rank="2">Apple: 50</li><li data-rank="1">Banana: 100</li><li data-rank="3">Cherry: 25</li></ul>'
  );
});

test('handles products with the same sales', () => {
  const products = [
    { id: 1, name: 'Apple', sales: 50 },
    { id: 2, name: 'Banana', sales: 50 },
    { id: 3, name: 'Cherry', sales: 25 },
  ];
  const result = renderProducts(products);
  assert.equal(
    result,
    '<ul><li data-rank="1">Apple: 50</li><li data-rank="2">Banana: 50</li><li data-rank="3">Cherry: 25</li></ul>'
  );
});
