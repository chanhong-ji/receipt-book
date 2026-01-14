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

  async findById(id: number): Promise<User | null> {
    const model = await this.repository.findOne({ where: { id } });
    if (!model) return null;
    return this.toEntity(model);
  }

  async findByEmail(email: string): Promise<User | null> {
    const model = await this.repository.findOne({ where: { email } });
    if (!model) return null;
    return this.toEntity(model);
  }

  async save(user: User): Promise<User> {
    const savedModel = await this.repository.save({
      email: user.email,
      name: user.name,
      password: user.password,
    });
    return this.toEntity(savedModel);
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
