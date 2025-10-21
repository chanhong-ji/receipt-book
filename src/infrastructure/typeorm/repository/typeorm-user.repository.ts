import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/modules/user/application/user.repository';
import { UserModel } from '../models/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/user/domain/entity/user.entity';

@Injectable()
export class TypeormUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserModel)
    private readonly repository: Repository<UserModel>,
  ) {}

  async findAll(): Promise<User[]> {
    const models = await this.repository.find();
    return models.map(this.toEntity);
  }

  toEntity(model: UserModel): User {
    const user = new User();
    user.id = model.id;
    user.email = model.email;
    user.name = model.name;
    user.password = model.password;
    user.createdAt = model.createdAt;
    user.updatedAt = model.updatedAt;
    return user;
  }
}
