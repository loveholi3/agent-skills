## 2024-05-19 - SSRF 보안 취약점 수정 (webhook.js)
**학습 내용:** SSRF (Server-Side Request Forgery) 취약점은 외부 URL을 fetch 할 때 리다이렉트를 맹목적으로 따르는 경우(`redirect: 'follow'`)에 발생할 수 있다. 악의적인 사용자가 내부 네트워크를 향하도록 리다이렉트하는 URL을 제공하여 시스템 권한을 탈취하거나 데이터를 유출할 수 있다.
**적용 계획:** 외부 URL을 fetch 하거나 HTTP 요청을 보낼 때 기본적으로 리다이렉트 정책(`redirect`)을 검토하고, 특별히 리다이렉트를 처리해야 하는 명확한 이유가 없다면 `redirect: 'error'` 또는 `redirect: 'manual'` 등을 명시적으로 설정하여 방어적으로 코드를 작성한다.
