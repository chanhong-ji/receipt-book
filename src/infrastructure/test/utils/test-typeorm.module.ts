import { TypeOrmModule } from '@nestjs/typeorm';

export const createTestTypeormModule = () => {
  return TypeOrmModule.forRootAsync({
    useFactory: () => {
      return {
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [__dirname + '/../../typeorm/models/*.model{.ts,.js}'],
        synchronize: true,
        dropSchema: true,
        logging: false,
      };
    },
  });
};
