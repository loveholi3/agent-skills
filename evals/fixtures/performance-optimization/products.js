'use strict';

function renderProducts(products) {
  // ⚡ Optimization: Sort the array once outside the loop to avoid O(n^2) complexity.
  // Pre-calculate ranks to allow O(1) lookups during the HTML rendering loop.
  const sorted = [...products].sort((a, b) => b.sales - a.sales);
  const ranks = new Map();
  for (let i = 0; i < sorted.length; i++) {
    // If multiple products have the same sales, they might get different ranks based on original order
    // But since findIndex returned the first match in the sorted array, it essentially gave a unique
    // rank index to each object based on its position in the sorted array, or if ids are duplicate,
    // the first matching id. Assuming unique ids for products.
    ranks.set(sorted[i].id, i + 1);
  }

  let html = '';
  for (const product of products) {
    const rank = ranks.get(product.id);
    html += `<li data-rank="${rank}">${product.name}: ${product.sales}</li>`;
  }
  return `<ul>${html}</ul>`;
}

module.exports = { renderProducts };
