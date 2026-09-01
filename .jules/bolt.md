## 2026-08-28 - Loop-Inside-Sort Anti-Pattern in Products Render
**학습 내용:** Found an $O(N^2 \log N)$ performance bottleneck where an array was being sorted inside a loop to determine rank `findIndex() + 1`. This was slowing down product list rendering severely.
**적용 계획:** Look out for redundant recalculations (e.g., sorting, map/reduce, or API calls) inside loops. When finding this pattern, extract the operation outside the loop and cache the results using a `Map` or similar data structure to bring the time complexity down to $O(N \log N) + O(N)$.
