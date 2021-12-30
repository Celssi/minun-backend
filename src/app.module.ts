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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 3306,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        cache: true,
      })
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
