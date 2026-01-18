// 카카오 챗봇 요청 DTO
export interface KakaoBattleRequestDto {
  action: {
    params: {
      monster_id: string
    }
  }
  userRequest: {
    user: {
      id: string // 카카오 사용자 ID
    }
  }
}
