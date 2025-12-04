# E2E 테스트 가이드

이 디렉토리에는 Receipt-book 프로젝트의 E2E(End-to-End) 테스트가 포함되어 있습니다.

## 폴더 구조

```
test/e2e/
├── flows/              # 실제 사용자 흐름을 테스트하는 테스트 파일들
│   ├── auth.e2e-spec.ts
│   ├── expense-crud.e2e-spec.ts
│   ├── expense-analytics.e2e-spec.ts
│   ├── category-crud.e2e-spec.ts
│   ├── account-crud.e2e-spec.ts
│   └── budget-crud.e2e-spec.ts
└── helpers/            # 공통 유틸리티 및 헬퍼 함수
    ├── test-app.ts
    ├── graphql-requests.ts
    └── test-data.factory.ts
```

### 1. 인증 흐름 (auth.e2e-spec.ts)

- ✅ createUser (회원가입)
- ✅ login (로그인)
- ✅ me (사용자 정보 조회)
- ✅ logout (로그아웃)

### 2. 지출 CRUD 흐름 (expense-crud.e2e-spec.ts)

- ✅ createExpense
- ✅ updateExpense
- ✅ deleteExpense
- ✅ findExpenseMonthly

### 3. 지출 분석 흐름 (expense-analytics.e2e-spec.ts)

- ✅ findSummary

### 4. 카테고리 CRUD 흐름 (category-crud.e2e-spec.ts)

- ✅ createCategory
- ✅ findCategories
- ✅ updateCategory
- ✅ deleteCategory

### 5. 계좌 CRUD 흐름 (account-crud.e2e-spec.ts)

- ✅ createAccount
- ✅ findAccounts
- ✅ updateAccount
- ✅ deleteAccount

### 6. 예산 CRUD 흐름 (budget-crud.e2e-spec.ts)

- ✅ upsertBudget
- ✅ findBudgets
- ✅ deleteBudget

## 실행 방법

```bash
# 모든 E2E 테스트 실행
npm run test:e2e

# 특정 테스트 파일만 실행
npm run test:e2e -- auth.e2e-spec.ts
npm run test:e2e -- expense-crud.e2e-spec.ts
npm run test:e2e -- category-crud.e2e-spec.ts
```

### 실행 흐름 기반 테스트

각 테스트 파일은 실제 사용자가 애플리케이션을 사용하는 시나리오를 따릅니다.

예시:

```
로그인 → 카테고리 생성 → 계좌 생성 → 지출 생성 → 지출 수정 → 지출 조회 → 지출 삭제
```

### 데이터베이스 격리

- 각 테스트는 독립적으로 실행됩니다
- 고유한 사용자 데이터를 생성하여 충돌을 방지합니다
- 타임스탬프를 활용한 유니크한 데이터 생성

## 헬퍼 파일 설명

### test-app.ts

NestJS 애플리케이션을 테스트 환경에서 초기화하고 종료하는 헬퍼 함수를 제공합니다.

### graphql-requests.ts

모든 GraphQL 쿼리와 뮤테이션을 정의합니다. 테스트에서 재사용 가능한 형태로 관리됩니다.

### test-data.factory.ts

테스트에 필요한 더미 데이터를 생성하는 팩토리 함수들을 제공합니다.

## 주의사항

1. **데이터베이스 설정**: 로컬 환경에서 E2E 테스트를 실행하는 경우 테스트용 데이터베이스가 설정되어 있어야 합니다.
2. **환경 변수**: 필요한 환경 변수(.env.test 파일)가 올바르게 설정되어 있는지 확인하세요.
3. **병렬 실행**: 현재 테스트는 순차적으로 실행됩니다. 병렬 실행 시 데이터베이스 충돌이 발생할 수 있습니다.
