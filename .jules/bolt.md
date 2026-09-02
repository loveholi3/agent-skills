## 2026-08-28 - Loop-Inside-Sort Anti-Pattern in Products Render
**학습 내용:** Found an $O(N^2 \log N)$ performance bottleneck where an array was being sorted inside a loop to determine rank `findIndex() + 1`. This was slowing down product list rendering severely.
**적용 계획:** Look out for redundant recalculations (e.g., sorting, map/reduce, or API calls) inside loops. When finding this pattern, extract the operation outside the loop and cache the results using a `Map` or similar data structure to bring the time complexity down to $O(N \log N) + O(N)$.
## 2024-05-24 - [Map Object Re-use Optimization]
**학습 내용:** [JavaScript에서 빈번하게 호출되는 반복문 내부(예: `rankSkills`)에서 매번 새로운 `Map` 객체를 생성하는 것은 가비지 컬렉션(GC) 오버헤드를 유발하여 성능 병목 현상을 일으킵니다.]
**적용 계획:** [데이터가 계속 변하는 반복문에서는 `Map`을 반복문 외부에 한 번 인스턴스화하고, 내부에서 다시 값을 할당하기 전에 `.clear()`를 호출하여 재사용함으로써 메모리 할당 및 GC 오버헤드를 방지합니다.]
