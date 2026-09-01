## 2023-11-20 - [Invalid JSON 파싱 에러 핸들링 테스트 추가]
**학습 내용:** Node.js의 내장 test runner (`node:test`)를 사용하여 에러 발생 상황을 시뮬레이션할 때, 샌드박스 환경(`makeSandbox`)에 잘못된 형태의 파일 포맷(e.g., `invalid json ]`)을 직접 주입한 후 spawn 프로세스의 status code와 에러 로그를 검증할 수 있다.
**적용 계획:** 엣지 케이스나 에러 핸들링 로직을 테스트할 때는 일관된 샌드박스 환경 설정 유틸리티를 활용하고, 발생한 에러 로그의 패턴 매칭(`/invalid JSON/`)과 exit code를 모두 확인하여 안정성을 확보한다.
