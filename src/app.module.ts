import { MiddlewareConsumer, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import configuration from './config/configuration';
import { AuthenticationGuard } from './common/auth/guard/authentication.guard';
import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './modules/category/category.module';
import { ExpenseModule } from './modules/expense/expense.module';
import { MerchantModule } from './modules/merchant/merchant.module';
import { AuthModule } from './common/auth/auth.module';
import { AccountModule } from './modules/account/account.module';
import { BudgetModule } from './modules/budget/budget.module';
import { join } from 'path';
import { AgentAdviceModule } from './modules/agent-advice/agent-advice.module';
import { ExcludeRoutesMiddleware } from './common/middleware/exclude-route.middleware';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      introspection: true, // for test
      autoSchemaFile: process.env.NODE_ENV === 'production' ? true : join(process.cwd(), 'schema.gql'),
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req, res }) => ({ req, res }),
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    UserModule,
    AccountModule,
    CategoryModule,
    ExpenseModule,
    MerchantModule,
    BudgetModule,
    AgentAdviceModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExcludeRoutesMiddleware).forRoutes('*');
  }
}
