# User 모듈

유저 관리를 담당하는 모듈입니다.

## 주요 기능

- 유저 생성 및 조회
- 카카오 유저 ID 기반 유저 관리
- 캐릭터 및 스탯 생성 (트랜잭션 처리)
- Slack 알림 연동

## API 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| POST | `/user/find-all` | 모든 유저 조회 |
| POST | `/user/save` | 새 유저 저장 |

## 관련 파일

- `user.controller.ts` - API 엔드포인트 정의
- `user.service.ts` - 비즈니스 로직
- `user.module.ts` - 모듈 설정
