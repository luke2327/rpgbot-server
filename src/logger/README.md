# Logger 모듈

커스텀 로깅을 담당하는 모듈입니다.

## 주요 기능

- 컨텍스트 기반 로깅 (클래스명, 메서드명)
- 타임스탬프 자동 추가
- 메타데이터 지원 (requestId, userId 등)
- 로그 레벨: `log`, `error`, `warn`, `debug`, `verbose`

## 사용 방법

```typescript
import { LoggerService } from 'src/logger'

// 의존성 주입
constructor(private readonly logger: LoggerService) {
  this.logger.setContext(MyService.name)
}

// 로깅
this.logger.log('메시지', { method: 'myMethod' })
this.logger.error('에러 발생', error.stack, { userId: '123' })
```

## 관련 파일

- `logger.service.ts` - 로깅 서비스 구현
- `logger.module.ts` - 글로벌 모듈 설정
- `index.ts` - 배럴 export
