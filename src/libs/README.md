# Libs 폴더

공통 유틸리티 및 헬퍼 함수들을 모아놓은 폴더입니다.

## 파일 목록

| 파일 | 설명 |
|------|------|
| `kakao.utils.ts` | 카카오 챗봇 응답 템플릿 헬퍼 |
| `entitiesResolver.ts` | TypeORM Entity 리졸버 |
| `utils.ts` | UUID 변환 등 공통 유틸리티 |

## 주요 기능

### kakao.utils.ts

```typescript
import { kakaoTemplate } from 'src/libs/kakao.utils'

// 단순 텍스트 응답
kakaoTemplate.simpleText('메시지')

// 텍스트 카드 응답
kakaoTemplate.textCard({
  title: '제목',
  description: '설명',
  buttons: [...]
})
```

### utils.ts

```typescript
import { uuidTransformer } from 'src/libs/utils'

// TypeORM 컬럼에서 UUID 변환용
@Column({ transformer: uuidTransformer })
userId: string
```
