# Configs 폴더

환경 설정 파일들을 모아놓은 폴더입니다.

## 구조

```
configs/
  └── env/
      ├── index.ts      # 환경 변수 export
      ├── .dev.env      # 개발 환경 설정
      └── .prod.env     # 운영 환경 설정
```

## 환경 변수

| 변수명 | 설명 |
|--------|------|
| `DB_HOST` | 데이터베이스 호스트 |
| `DB_PORT` | 데이터베이스 포트 |
| `DB_USER` | 데이터베이스 사용자 |
| `DB_PASSWORD` | 데이터베이스 비밀번호 |
| `DB_NAME` | 데이터베이스 이름 |
| `SLACK_TOKEN` | Slack Bot 토큰 |

## 사용 방법

```typescript
import { env } from 'src/configs/env'

const dbHost = env.DB_HOST
```
