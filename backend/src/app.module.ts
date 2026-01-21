import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';



// Modules
import { AuthModule } from './modules/auth/auth.module';
import { IamModule } from './modules/iam/iam.module';
import { PresenceModule } from './modules/presence/presence.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { TeamsModule } from './modules/teams/teams.module';
import { NotificationsModule } from './modules/notifications/notifications.module';


// Common
import { RlsInterceptor } from './common/interceptors/rls.interceptor';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('DATABASE_URL');
        const isProduction = config.get('NODE_ENV') === 'production';

        const options: any = {
          type: 'postgres',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: false,
          logging: !isProduction,
          ssl: url || config.get('DATABASE_SSL') === 'true'
            ? { rejectUnauthorized: false }
            : false,
        };

        if (url && url.startsWith('postgres')) {
          options.url = url;
        } else {
          const host = config.get<string>('DATABASE_HOST');
          const port = config.get<number>('DATABASE_PORT', 5432);
          options.host = host;
          options.port = port;
          options.username = config.get<string>('DATABASE_USER');
          options.password = config.get<string>('DATABASE_PASSWORD');
          options.database = config.get<string>('DATABASE_NAME');
        }

        return options;
      },
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100, // 100 requests per minute
    }]),
    AuthModule,
    IamModule,
    PresenceModule,
    ProjectsModule,
    DashboardModule,
    TeamsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RlsInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }
