# Error-Log 모듈

에러 로그를 데이터베이스에 저장하는 모듈입니다.

## 주요 기능

- 에러 발생 시 DB에 로그 저장
- 에러 레벨 지원: `error`, `warn`, `fatal`
- 요청 정보 기록 (URL, Method, userId)
- 메타데이터 JSON 저장

## 사용 방법

```typescript
import { ErrorLogService } from 'src/error-log'

// 의존성 주입
constructor(private readonly errorLogService: ErrorLogService) {}

// 에러 로깅
await this.errorLogService.create({
  level: 'error',
  message: '에러 메시지',
  stackTrace: error.stack,
  context: 'MyService',
  method: 'myMethod',
  userId: 'user-123',
  metadata: { additionalInfo: 'value' },
})
```

## 관련 파일

- `error-log.service.ts` - 에러 로깅 서비스
- `error-log.module.ts` - 글로벌 모듈 설정
- `index.ts` - 배럴 export

## 관련 테이블

- `error_logs` - SQL 스키마: `/sql/error_logs.sql`
