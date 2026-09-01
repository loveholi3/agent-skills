'use strict';

function renderProducts(products) {
  // Optimization: Sort once outside the loop to prevent O(N^2 log N) complexity.
  // Pre-calculate ranks and store in a Map for O(1) lookups during iteration.
  const sortedProducts = [...products].sort((a, b) => b.sales - a.sales);
  const rankMap = new Map();

  for (let i = 0; i < sortedProducts.length; i++) {
    // Only set the rank the first time we see an ID (in case of duplicates) to match findIndex behavior
    if (!rankMap.has(sortedProducts[i].id)) {
      rankMap.set(sortedProducts[i].id, i + 1);
    }
  }

  let html = '';
  for (const product of products) {
    const rank = rankMap.get(product.id);
    html += `<li data-rank="${rank}">${product.name}: ${product.sales}</li>`;
  }
  return `<ul>${html}</ul>`;
}

module.exports = { renderProducts };
