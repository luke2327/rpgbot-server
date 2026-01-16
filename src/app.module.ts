import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from 'src/app.controller'
import { AppService } from 'src/app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { env } from 'src/configs/env'
import { UserModule } from 'src/user/user.module'
import { SlackService } from 'src/slack/slack.service'
import { MockModule } from 'src/mock/mock.module'
import { entitiesResolver } from 'src/libs/entitiesResolver'
import { LoggerModule } from 'src/logger'

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
    LoggerModule,
    UserModule,
    MockModule,
  ],
  controllers: [AppController],
  providers: [AppService, SlackService],
})
export class AppModule {}
