-- 몬스터 테이블에 표시용 컬럼 추가

ALTER TABLE monsters
ADD COLUMN image_url VARCHAR(500) NULL COMMENT '몬스터 이미지 URL (thumbnail)',
ADD COLUMN name_en VARCHAR(100) NULL COMMENT '영문 이름 (basicCard title에 사용)',
ADD COLUMN simple_text TEXT NULL COMMENT 'simpleText 영역 전체 내용',
ADD COLUMN card_description TEXT NULL COMMENT 'basicCard description 전체 내용';

-- 기존 데이터 업데이트 예시 (실제 데이터로 수정 필요)

-- 몬스터 ID 1: 슬라임
UPDATE monsters
SET
  image_url = 'http://k.kakaocdn.net/dn/your-image-url/slime.jpg',
  name_en = 'Slime',
  simple_text = '모험을 시작합니다! 앞에 끈적끈적한 것이 보입니다...\n\n【슬라임】 (Lv.1)\n"끈적..."\n몬스터 체력: 50 / 50 HP\n\n(약한 슬라임이 천천히 다가옵니다!)',
  card_description = '초보자용 몬스터\n약한 공격 | 낮은 방어력\nHP: 50 / 50\n(끈적끈적한 슬라임이 기어옵니다!)'
WHERE monster_id = 1;

-- 몬스터 ID 2: 고블린 정찰병
UPDATE monsters
SET
  image_url = 'http://k.kakaocdn.net/dn/4cJBl/btsSLgCieCr/DcAFhQ3IaOR9Vw0sGsmSKK/800x800.jpg',
  name_en = 'Goblin Scout',
  simple_text = '슬라임을 물리쳤습니다! 다음 적이 숨어 있습니다...\n\n【고블린 정찰병】 (Lv.4)\n"키키킥..."\n몬스터 체력: 60 / 60 HP\n\n(조심! 은밀하게 다가오고 있어요!)',
  card_description = '초보자용 몬스터\n속도 약간 빠름 | 약한 단검\nHP: 60 / 60\n(녹색 고블린이 은밀히 다가옵니다!)'
WHERE monster_id = 2;

-- 몬스터 ID 3: 거대 거미
UPDATE monsters
SET
  image_url = 'http://k.kakaocdn.net/dn/b445ez/btsSLY8V5nh/pmVtTGUdeBZsn5fihEq3x1/800x800.jpg',
  name_en = 'Giant Spider',
  simple_text = '스켈레톤을 부수고 나아갑니다! 끈적한 실이 느껴져요...\n\n【거대 거미】 (Lv.13)\n"치익... 치익..."\n몬스터 체력: 120 / 120 HP\n\n(독니를 드러내며 천장에서 내려오고 있어요!)',
  card_description = '초보자용 몬스터\n독 주사 | 거미줄 함정\nHP: 120 / 120\n(독니를 드러내며 천장에서 떨어집니다!)'
WHERE monster_id = 3;
