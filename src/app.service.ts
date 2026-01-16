import { Injectable } from '@nestjs/common'
import { WebClient } from '@slack/web-api'
import { JoinUserDTO } from './dtos/joinUserDto'
import { env } from './configs/env'
import { kakaoTemplate } from './libs/kakao.utils'
import { SlackService } from './slack/slack.service'
import { slackChannel } from './constants/slack-channel'
import { LoggerService } from './logger'
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  connectionLimit: 10, // 최대 연결 수
  waitForConnections: true,
  queueLimit: 0,
})

@Injectable()
export class AppService {
  constructor(
    private readonly slackService: SlackService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(AppService.name)
  }

  getHello(): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>NestJS on Vercel</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: linear-gradient(135deg, #000 0%, #111 100%);
          color: #fff;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          text-align: center;
          max-width: 600px;
          padding: 2rem;
        }
        .logo {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          margin: 0 auto 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.5rem;
        }
        h1 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: white;
        }
        p {
          font-size: 1.125rem;
          color: #888;
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }
        .feature {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 1rem;
          backdrop-filter: blur(10px);
        }
        .feature h3 {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .feature a {
          font-size: 1rem;
          color: white;
          margin: 0;
          text-decoration: none;
        }
        .feature a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img src="https://api-frameworks.vercel.sh/framework-logos/nestjs.svg" alt="Nitro logo" class="logo" />
        <h1>알피지봇 서버</h1>
        <p>A progressive Node.js framework running on Vercel</p>
        <div class="features">
          <div class="feature">
            <a href="https://vercel.com/docs/frameworks/nestjs" target="_blank" rel="noreferrer">Vercel docs</a>
          </div>
          <div class="feature">
            <a href="https://docs.nestjs.com" target="_blank" rel="noreferrer">NestJS docs</a>
          </div>
        </div>
      </div>
    </body>
    </html>
    `
  }

  async postShowMyId(body: unknown) {
    await this.slackService.web.chat.postMessage({
      channel: slackChannel.joinChannel,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '신규유저가입',
          },
        },
        {
          type: 'section',
          text: {
            text: `\`\`\`${JSON.stringify(body, null, 2)}\`\`\``,
            type: 'mrkdwn',
          },
        },
      ],
    })

    return kakaoTemplate.simpleText(
      `너의 카카오톡 고유 ID는:\n${JSON.stringify(body)}`,
    )
  }

  async postJoinUser(joinUserDTO: JoinUserDTO) {
    const web = new WebClient(env.SLACK_TOKEN)

    const testObj = {
      test: 1,
      value: 2,
    }

    const result = await web.chat.postMessage({
      channel: joinUserDTO.channel,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '신규유저가입',
          },
        },
        {
          type: 'section',
          text: {
            text: `\`\`\`${JSON.stringify(joinUserDTO || testObj, null, 2)}\`\`\``,
            type: 'mrkdwn',
          },
        },
      ],
    })

    this.logger.log(`Successfully send message ${result.ts} in conversation T0A8YGX24FK`, { method: 'postJoinUser' })
  }

  async joinUser(body: unknown) {
    // body를 안전하게 타입 단언 (any 경고 해결)
    const payload = body as {
      userRequest?: {
        user?: {
          id: string
        }
      }
    }

    const userId = payload?.userRequest?.user?.id

    if (!userId) {
      return kakaoTemplate.simpleText(
        '유저 ID를 가져오지 못했습니다. 다시 시도해주세요.',
      )
    }

    const connection = await pool.getConnection()
    try {
      // DB에 저장 (중복이면 무시)
      await connection.query(
        'INSERT IGNORE INTO `user` (user_id, created_at) VALUES (UNHEX(?), NOW())',
        [userId.replace(/-/g, '')], // 하이픈 제거해서 32자리 hex로 변환
      )

      // simpleText로 간단히 응답
      return kakaoTemplate.simpleText(
        `가입 완료!\n` +
          `너의 카카오톡 고유 ID: ${userId}\n` +
          `이제 모험을 시작할 수 있어요!`,
      )
    } catch (error) {
      this.logger.error('DB 저장 에러', error instanceof Error ? error.stack : String(error), { method: 'joinUser' })
      return kakaoTemplate.simpleText(
        '가입 중 오류가 발생했습니다. 다시 시도해주세요.',
      )
    } finally {
      connection.release()
    }
  }

  async saveJob(body: unknown) {
    // body를 안전하게 타입 단언 (action.params.job 접근 에러 해결)
    const payload = body as {
      action?: {
        params?: {
          job?: string
        }
      }
    }

    // job 값 추출
    const job = payload?.action?.params?.job

    if (!job) {
      return kakaoTemplate.simpleText('직업 정보를 가져오지 못했습니다.')
    }

    const connection = await pool.getConnection().catch((err) => {
      this.logger.error('DB 연결 실패', err instanceof Error ? err.stack : String(err), { method: 'saveJob' })
      return null
    })

    if (!connection) {
      return kakaoTemplate.simpleText(
        '서버 연결 오류입니다. 다시 시도해주세요.',
      )
    }

    try {
      // 임의의 userId 숫자 (테스트용: 999999)
      const testUserId = '4A335D1EF0D210EA6ABB20995EEAFA3D' // ← 여기서 임의 숫자 고정 (실제로는 32자리 hex)

      // DB에 job + 임의 userId 저장
      await connection.query(
        'INSERT INTO characters (user_id, job) VALUES (?, ?) ON DUPLICATE KEY UPDATE job = ?',
        [testUserId, job, job],
      )

      return kakaoTemplate.simpleText(
        `직업이 ${job}으로 저장됐습니다! (테스트 userId: ${testUserId})`,
      )
    } catch (error) {
      this.logger.error('DB 저장 에러', error instanceof Error ? error.stack : String(error), { method: 'saveJob' })
      return kakaoTemplate.simpleText('저장 실패! 다시 시도해주세요.')
    } finally {
      connection.release()
    }
  }
}
