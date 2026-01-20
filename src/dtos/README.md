# DTOs 폴더

Data Transfer Object 파일들을 모아놓은 폴더입니다.

## DTO 목록

| 파일 | 설명 |
|------|------|
| `save-user.dto.ts` | 유저 저장 요청 DTO (카카오 챗봇) |
| `join-user.dto.ts` | 유저 가입 요청 DTO |
| `battle.dto.ts` | 전투 결과 DTO |
| `kakao-battle.dto.ts` | 카카오 챗봇 전투 요청 DTO |
| `create-error-log.dto.ts` | 에러 로그 생성 DTO |
| `create-mock.dto.ts` | Mock 생성 DTO |
| `update-mock.dto.ts` | Mock 수정 DTO |

## 사용 방법

```typescript
import { SaveUserDto } from 'src/dtos/save-user.dto'
import { BattleResult } from 'src/dtos/battle.dto'
```
