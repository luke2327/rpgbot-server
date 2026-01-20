# Entities 폴더

TypeORM Entity 파일들을 모아놓은 폴더입니다.

## Entity 목록

| 파일 | 테이블 | 설명 |
|------|--------|------|
| `user.entity.ts` | `user` | 유저 정보 |
| `characters.entity.ts` | `characters` | 캐릭터 정보 (직업, 레벨, 골드 등) |
| `stats.entity.ts` | `stats` | 캐릭터 스탯 (HP, STR, DEX 등) |
| `monsters.entity.ts` | `monsters` | 몬스터 정보 |
| `error-log.entity.ts` | `error_logs` | 에러 로그 |
| `mock.entity.ts` | - | Mock 엔티티 (테스트용) |

## Entity 관계

```
User (1) ──── (N) Characters (1) ──── (1) Stats
```

## 사용 방법

```typescript
import { UserEntity } from 'src/entities/user.entity'
import { CharactersEntity } from 'src/entities/characters.entity'
```
