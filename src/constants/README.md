# Constants 폴더

상수 값들을 모아놓은 폴더입니다.

## 파일 목록

| 파일 | 설명 |
|------|------|
| `slack-channel.ts` | Slack 채널 ID 상수 |

## 사용 방법

```typescript
import { slackChannel } from 'src/constants/slack-channel'

// Slack 채널로 메시지 전송
await slackService.web.chat.postMessage({
  channel: slackChannel.joinChannel,
  text: '메시지',
})
```
