import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { env } from './configs/env'
import { UserModule } from './user/user.module'
import { SlackService } from './slack/slack.service'
import { MockModule } from './mock/mock.module'
import { entitiesResolver } from './libs/entitiesResolver'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `src/configs/env/.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: env.DB_HOST,
      port: env.DB_PORT,
      username: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      entities: entitiesResolver(),
      synchronize: false,
    }),
    UserModule,
    MockModule,
  ],
  controllers: [AppController],
  providers: [AppService, SlackService],
})
export class AppModule {}
