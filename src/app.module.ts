import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { Dialect } from 'sequelize/types';

const cookieSession = require('cookie-session');

const { NODE_ENV } = process.env;

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${NODE_ENV}`,
    }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          // dialect: 'sqlite',
          dialect: config.get<Dialect>('DB_DIALECT'),
          database: 'sqlite',
          storage: config.get<string>('DB_NAME'),
          autoLoadModels: true,
          synchronize: true,
        };
      },
    }),
    // SequelizeModule.forRoot({
    //   dialect: 'sqlite',
    //   database: 'sqlite',
    //   storage: 'db.sqlite',
    //   autoLoadModels: true,
    //   synchronize: true,
    // }),
    UsersModule,
    ReportsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ['this_is_a_test_key'],
        }),
      )
      .forRoutes('*');
  }
}
