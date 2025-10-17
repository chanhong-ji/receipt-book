import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormUserRepository } from './repository/typeorm-user.repository';
import { UserModel } from './models/user.model';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  providers: [{ provide: 'UserRepository', useClass: TypeormUserRepository }],
  exports: ['UserRepository'],
})
export class RepositoryModule {}
