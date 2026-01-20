# Mock 모듈

테스트 및 개발용 Mock API를 제공하는 모듈입니다.

## 주요 기능

- CRUD 기본 구조 제공
- 개발 및 테스트 목적

## API 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| POST | `/mock` | Mock 생성 |
| GET | `/mock` | 전체 조회 |
| GET | `/mock/:id` | 단일 조회 |
| PATCH | `/mock/:id` | 수정 |
| DELETE | `/mock/:id` | 삭제 |

## 관련 파일

- `mock.controller.ts` - API 엔드포인트 정의
- `mock.service.ts` - 비즈니스 로직
- `mock.module.ts` - 모듈 설정
