# Slack 모듈

Slack 메시지 전송을 담당하는 모듈입니다.

## 주요 기능

- Slack WebClient 초기화
- 채널별 메시지 전송
- 블록 형식 메시지 지원

## 사용 방법

```typescript
import { SlackService } from 'src/slack/slack.service'

// 의존성 주입
constructor(private readonly slackService: SlackService) {}

// 메시지 전송
await this.slackService.web.chat.postMessage({
  channel: 'channel-id',
  text: '메시지 내용',
})
```

## 관련 파일

- `slack.service.ts` - Slack WebClient 래퍼 서비스
