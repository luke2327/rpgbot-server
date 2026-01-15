export const kakaoTemplate = {
  simpleText: (data: string) => {
    return {
      version: '2.0',
      template: {
        outputs: [
          {
            simpleText: {
              text: data,
            },
          },
        ],
      },
    }
  },
}
