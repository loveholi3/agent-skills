'use strict';

function renderProducts(products) {
  // O(N log N) pre-sorting to avoid O(N^2 log N) performance hit inside the loop
  const sortedProducts = [...products].sort((a, b) => b.sales - a.sales);
  const rankMap = new Map();

  for (let i = 0; i < sortedProducts.length; i++) {
    rankMap.set(sortedProducts[i].id, i + 1);
  }

  let html = '';
  for (const product of products) {
    const rank = rankMap.get(product.id);
    html += `<li data-rank="${rank}">${product.name}: ${product.sales}</li>`;
  }
  return `<ul>${html}</ul>`;
}

module.exports = { renderProducts };
