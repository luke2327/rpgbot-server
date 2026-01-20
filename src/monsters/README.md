# Monsters 모듈

몬스터 및 전투 시스템을 담당하는 모듈입니다.

## 주요 기능

- 몬스터 목록 조회
- 몬스터 정보 조회 (카카오 챗봇용)
- 턴제 전투 시스템
- 전투 결과에 따른 경험치/골드 지급
- 에러 로깅 (ErrorLogService 연동)

## API 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| GET | `/monsters/list` | 모든 몬스터 조회 |
| POST | `/monsters/info` | 몬스터 정보 조회 (카카오 챗봇) |
| POST | `/monsters/battle` | 전투 실행 (카카오 챗봇) |

## 관련 파일

- `monsters.controller.ts` - API 엔드포인트 정의
- `monsters.service.ts` - 전투 로직 및 비즈니스 로직
- `monsters.module.ts` - 모듈 설정
