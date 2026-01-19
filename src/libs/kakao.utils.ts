export const kakaoTemplate = {
  /**
   *
   * @param text
   * {@link https://kakaobusiness.gitbook.io/main/tool/chatbot/skill_guide/answer_json_format#example_code-6}
   */
  simpleText: (text: string) => {
    return {
      version: '2.0',
      template: {
        outputs: [
          {
            simpleText: {
              text: text,
            },
          },
        ],
      },
    }
  },
  /**
   *
   * @param textCard
   * {@link https://kakaobusiness.gitbook.io/main/tool/chatbot/skill_guide/answer_json_format#example_code-8}
   */
  textCard: (textCard: TextCard) => {
    return {
      version: '2.0',
      template: {
        outputs: [{ textCard }],
      },
    }
  },
  /**
   *
   * @param basicCard
   * {@link https://kakaobusiness.gitbook.io/main/tool/chatbot/skill_guide/answer_json_format#example_code-9}
   */
  basicCard: (basicCard: BasicCard) => {
    return {
      version: '2.0',
      template: {
        outputs: [{ basicCard }],
      },
    }
  },
}

type BasicCard = {
  title: string
  description: string
  thumbnail: string
  buttons: CardButton[]
}

type TextCard = {
  title: string
  description: string
  buttons: CardButton[]
}

type CardButton = {
  action: string
  label: string
  webLinkUrl?: string
  blockId?: string
  extra?: Record<string, any>
}
