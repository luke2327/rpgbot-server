# Types 폴더

TypeScript 타입 정의 파일들을 모아놓은 폴더입니다.

## 파일 목록

| 파일 | 설명 |
|------|------|
| `kakao.type.ts` | 카카오 챗봇 요청/응답 타입 |

## 주요 타입

### kakao.type.ts

```typescript
import {
  Bot,
  Intent,
  Action,
  UserRequest,
  Flow
} from 'src/types/kakao.type'
```

| 타입 | 설명 |
|------|------|
| `Bot` | 봇 정보 |
| `Intent` | 인텐트 정보 |
| `Action<T>` | 액션 정보 (제네릭 clientExtra) |
| `UserRequest` | 유저 요청 정보 |
| `Flow` | 플로우 정보 |
