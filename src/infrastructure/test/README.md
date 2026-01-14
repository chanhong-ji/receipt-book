## 유닛 테스트 가이드

프로젝트의 유닛 테스트는 크게 2가지 유형으로 나뉩니다.

- **usecase 테스트**: 도메인/유스케이스 로직을 빠르게 검증(인프라 의존 X, 기본 병렬)
- **repository 테스트**: TypeORM 매핑/쿼리를 실제 Postgres로 검증(Docker/Testcontainers 필요, 직렬)

> 참고: E2E 테스트는 `test/e2e/README.md`를 따릅니다. (이 문서는 “unit/infrastructure test” 범위만 다룹니다)

---

## 어떤 테스트를 작성할까?

- **usecase**를 우선으로 작성합니다. (빠르고, 실패 원인 파악이 쉽습니다)
- 아래 조건에 해당하면 **repository** 테스트를 추가합니다.
  - TypeORM 매핑(컬럼/관계/인덱스)이나 실제 쿼리 동작을 검증해야 함
  - “DB에서 어떻게 저장/조회되는가” 자체가 요구사항인 경우

요약 표:

| 구분       | 파일 패턴                     | 의존성                            | 속도/안정성       | 무엇을 검증?              |
| ---------- | ----------------------------- | --------------------------------- | ----------------- | ------------------------- |
| usecase    | `src/**/*.usecase.spec.ts`    | 없음(모킹)                        | 빠름/안정적(병렬) | 비즈니스 규칙/분기/에러   |
| repository | `src/**/*.repository.spec.ts` | Docker + Postgres(Testcontainers) | 느림(직렬)        | TypeORM 매핑/DB 쿼리 결과 |

---

## 실행 방법

```bash
# 전체 유닛 테스트(usecase → repository 순서)
npm test

# usecase 테스트만(기본 병렬)
npm run test:usecase

# repository 테스트만(도커 필요, 직렬)
npm run test:repo
```

디버깅이 필요하면(임시):

```bash
# usecase도 직렬로 돌려서 원인 좁히기
npx jest --selectProjects=usecase --runInBand
```

---

## usecase 테스트 가이드(병렬 실행)

### 규칙

- 파일명은 반드시 `*.usecase.spec.ts`
- 외부 의존성(repository 등)은 **mock/stub** 처리
- 전역 상태/싱글톤/static 캐시 등 **공유 상태를 만들지 않기**

### 권장 템플릿

```ts
describe('SomeUsecase', () => {
  it('성공: ...하면 -> ...한다', async () => {
    // Given
    // When
    // Then
  });
});
```

---

## repository 테스트 가이드(Docker 기반 + 직렬 실행)

repository 테스트는 “코드가 DB에서 어떻게 동작하는지”를 검증합니다.  
그래서 **실제 Postgres**(Testcontainers)로 테스트합니다.

- `globalSetup`: Postgres 컨테이너 시작 + DB 접속 정보 환경변수 주입
- `globalTeardown`: 컨테이너 종료
- `createTestTypeormModule()`: 주입된 환경변수로 TypeORM 연결 구성

관련 파일:

- `src/infrastructure/test/utils/unit-global-setup.ts`
- `src/infrastructure/test/utils/unit-global-teardown.ts`
- `src/infrastructure/test/utils/test-typeorm.module.ts`

repository 프로젝트는 다음 설정을 사용합니다.

- 컨테이너/환경변수가 **Jest global scope에서 공유**
- TypeORM 테스트 설정이 `dropSchema: true`로 스키마를 초기화

repository 테스트는 **직렬 실행(`--runInBand`)** 을 기본으로 합니다.

### 실행 전 체크리스트(필수)

- 로컬에 **Docker가 실행 중**이어야 합니다. (Docker Desktop / Colima 등)
- 최초 실행 시 이미지를 pull 하느라 시간이 걸릴 수 있습니다.
- 로컬에서는 `.withReuse()`로 컨테이너 재사용이 시도됩니다(속도 개선). CI 환경에서는 보통 재사용되지 않습니다.

### 권장 템플릿(예시)

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { createTestTypeormModule } from '../utils/test-typeorm.module';

describe('TypeormSomethingRepository', () => {
  let repository: unknown;
  let database: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        createTestTypeormModule(),
        TypeOrmModule.forFeature([
          /* 필요한 Model들 */
        ]),
      ],
      providers: [
        {
          provide: 'SomethingRepository', // 앱에서 쓰는 토큰과 동일하게 맞춥니다
          useClass: /* TypeormSomethingRepository */,
        },
      ],
    }).compile();

    database = module.get(DataSource);
    repository = module.get('SomethingRepository');
  });

  it('...하면 -> ...한다', async () => {
    // Given: seed
    // When: 호출
    // Then: 검증
  });
});
```

---

## 테스트 유틸 / 헬퍼

repository 테스트에서 DB 준비를 돕는 유틸을 제공합니다.

- `src/infrastructure/test/utils/test-typeorm.module.ts`
- `src/infrastructure/test/utils/helper/user.helper.ts`
- `src/infrastructure/test/utils/helper/account.helper.ts`

각 헬퍼는 기본값으로 타임스탬프 기반 값을 사용해 **데이터 충돌 가능성**을 줄입니다.
