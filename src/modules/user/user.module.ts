import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { RepositoryModule } from 'src/infrastructure/typeorm/repository.module';

@Module({
  imports: [RepositoryModule],
  providers: [UserResolver],
})
export class UserModule {}
