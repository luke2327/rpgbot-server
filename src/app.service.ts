import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';

@Injectable()
export class AppService {
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
    `;
  }

  getTest(someValue: any): any {
    console.log(someValue);
    return {
      version: '2.0',
      template: {
        outputs: [
          {
            textCard: {
              title: '알피지봇 고객센터입니다',
              description: '알피지봇 고객센터입니다. 무엇을 도와드릴까요?',
              buttons: [
                {
                  action: 'webLink',
                  label: '고객센터 바로가기',
                  webLinkUrl:
                    'https://i.namu.wiki/i/TsFafjblDnyTKCExv44F2IfPLUwL6eWtvEEe-CAhCHim9xV9m497hhAa8EOf_lbM44wFyCEKrkGdEC_pYM7-Mg.webp',
                },
                {
                  action: 'webLink',
                  label: '밥먹으러 가기',
                  webLinkUrl:
                    'https://i.namu.wiki/i/TsFafjblDnyTKCExv44F2IfPLUwL6eWtvEEe-CAhCHim9xV9m497hhAa8EOf_lbM44wFyCEKrkGdEC_pYM7-Mg.webp',
                },
              ],
            },
          },
        ],
      },
    };
  }

  async postJoinUser() {
    const token = process.env.SLACK_TOKEN;
    console.log('TOKEN ::', token);
    const web = new WebClient(token);

    const result = await web.chat.postMessage({
      channel: 'C0A8YGXA7FB',
      blocks: [
        {
          type: 'context',
          elements: [
            {
              type: 'plain_text',
              text: 'ss',
            },
          ],
        },
      ],
    });

    console.log(
      `Successfully send message ${result.ts} in conversation T0A8YGX24FK`,
    );
  }
}
