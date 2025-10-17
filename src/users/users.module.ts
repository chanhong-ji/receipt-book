import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { RepositoryModule } from 'src/infrastructure/typeorm/repository.module';

@Module({
  imports: [RepositoryModule],
  providers: [UsersResolver],
})
export class UserModule {}
