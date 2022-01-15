import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {MailerModule} from '@nestjs-modules/mailer';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {join} from 'path';
import {MulterModule} from '@nestjs/platform-express';
import {UsersModule} from './users/users.module';
import {LoginModule} from './login/login.module';
import {VersionController} from './versions/version.controller';
import dbConfig from './database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => (dbConfig)
    }),
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: 'smtp-mail.outlook.com',
          secure: false,
          auth: {
            user: config.get('EMAIL_ADDRESS'),
            pass: config.get('EMAIL_PASSWORD')
          }
        },
        defaults: {
          from: `"XKey" <${config.get('EMAIL_ADDRESS')}>`
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          }
        }
      }),
      inject: [ConfigService]
    }),
    UsersModule,
    LoginModule,
    MulterModule.register({
      dest: './upload',
    })
  ],
  controllers: [VersionController],
  providers: []
})
export class AppModule {
}
