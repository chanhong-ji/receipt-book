import { User } from 'src/modules/user/domain/entity/user.entity';

export class Category {
  id: number;
  name: string;
  user?: User; // 없는 경우 전체 유저 카테고리
  sortOrder: number; // 정렬 순서
  createdAt: Date;
  updatedAt: Date;
}
