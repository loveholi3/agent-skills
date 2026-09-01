## 2026-09-01 - [Node.js 환경에서의 글로벌 DOM 모킹 및 안전한 해제]
**학습 내용:** [node:test를 사용하여 브라우저 전용 코드(DOM 의존성)를 Node 환경에서 테스트할 때, `global.document`, `global.Blob`, `global.URL` 등을 모킹하고 `t.after()` 훅을 사용하여 안전하게 원래 상태로 복원(Teardown)해야 테스트 간 오염(Pollution)을 방지할 수 있습니다.]
**적용 계획:** [향후 브라우저 API에 의존하는 코드를 Node 환경에서 테스트할 때는 반드시 t.after() 내에서 모킹된 글로벌 객체들을 초기 상태로 복구하여 견고하고 독립적인 테스트를 구성합니다.]