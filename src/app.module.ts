import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './users/users.module';

import { AppController } from './app.controller';
import configuration from './config/configuration';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      graphiql: true,
      autoSchemaFile: true,
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    UserModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
