'use strict';

function renderProducts(products) {
  // O(N log N) optimization: Sort once and map ranks
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
