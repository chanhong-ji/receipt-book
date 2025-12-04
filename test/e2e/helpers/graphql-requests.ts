// GraphQL 쿼리 및 뮤테이션 정의

// ============ User Mutations & Queries ============
export const CREATE_USER_MUTATION = `
  mutation CreateUser($CreateUserInput: CreateUserInput!) {
    createUser(CreateUserInput: $CreateUserInput) {
      ok
      error
      userId
    }
  }
`;

export const LOGIN_MUTATION = `
  mutation Login($LoginInput: LoginInput!) {
    login(LoginInput: $LoginInput) {
      ok
      error
      userId
      token
    }
  }
`;

export const ME_QUERY = `
  query Me {
    me {
      ok
      error
      user {
        id
        email
        name
      }
    }
  }
`;

export const LOGOUT_MUTATION = `
  mutation Logout {
    logout
  }
`;

// ============ Category Mutations & Queries ============
export const CREATE_CATEGORY_MUTATION = `
  mutation CreateCategory($CreateCategoryInput: CreateCategoryInput!) {
    createCategory(CreateCategoryInput: $CreateCategoryInput) {
      ok
      error
      category {
        id
        name
      }
    }
  }
`;

export const FIND_CATEGORIES_QUERY = `
  query FindCategories {
    findCategories {
      ok
      error
      categories {
        id
        name
      }
    }
  }
`;

export const UPDATE_CATEGORY_MUTATION = `
  mutation UpdateCategory($UpdateCategoryInput: UpdateCategoryInput!) {
    updateCategory(UpdateCategoryInput: $UpdateCategoryInput) {
      ok
      error
      category {
        id
        name
      }
    }
  }
`;

export const DELETE_CATEGORY_MUTATION = `
  mutation DeleteCategory($DeleteCategoryInput: DeleteCategoryInput!) {
    deleteCategory(DeleteCategoryInput: $DeleteCategoryInput) {
      ok
      error
    }
  }
`;

// ============ Account Mutations & Queries ============
export const CREATE_ACCOUNT_MUTATION = `
  mutation CreateAccount($CreateAccountInput: CreateAccountInput!) {
    createAccount(CreateAccountInput: $CreateAccountInput) {
      ok
      error
      account {
        id
        name
        type
      }
    }
  }
`;

export const FIND_ACCOUNTS_QUERY = `
  query FindAccounts {
    findAccounts {
      ok
      error
      accounts {
        id
        name
        type
        isActive
      }
    }
  }
`;

export const UPDATE_ACCOUNT_MUTATION = `
  mutation UpdateAccount($UpdateAccountInput: UpdateAccountInput!) {
    updateAccount(UpdateAccountInput: $UpdateAccountInput) {
      ok
      error
      account {
        id
        name
        type
        isActive
      }
    }
  }
`;

export const DELETE_ACCOUNT_MUTATION = `
  mutation DeleteAccount($DeleteAccountInput: DeleteAccountInput!) {
    deleteAccount(DeleteAccountInput: $DeleteAccountInput) {
      ok
      error
    }
  }
`;

// ============ Expense Mutations & Queries ============
export const CREATE_EXPENSE_MUTATION = `
  mutation CreateExpense($CreateExpenseInput: CreateExpenseInput!) {
    createExpense(CreateExpenseInput: $CreateExpenseInput) {
      ok
      error
      expense {
        id
        name
        amount
        postedAt
        accountId
        categoryId
        merchantText
        memo
      }
    }
  }
`;

export const UPDATE_EXPENSE_MUTATION = `
  mutation UpdateExpense($UpdateExpenseInput: UpdateExpenseInput!) {
    updateExpense(UpdateExpenseInput: $UpdateExpenseInput) {
      ok
      error
      expense {
        id
        name
        amount
        postedAt
        accountId
        categoryId
        merchantText
        memo
      }
    }
  }
`;

export const DELETE_EXPENSE_MUTATION = `
  mutation DeleteExpense($DeleteExpenseInput: DeleteExpenseInput!) {
    deleteExpense(DeleteExpenseInput: $DeleteExpenseInput) {
      ok
      error
    }
  }
`;

export const FIND_EXPENSE_MONTHLY_QUERY = `
  query FindExpenseMonthly($FindExpenseMonthlyInput: FindExpenseMonthlyInput!) {
    findExpenseMonthly(FindExpenseMonthlyInput: $FindExpenseMonthlyInput) {
      ok
      error
      expenses {
        id
        name
        amount
        postedAt
        accountId
        categoryId
      }
      totalCount
    }
  }
`;

export const FIND_MONTHLY_EXPENSE_TOTAL_QUERY = `
  query FindMonthlyExpenseTotal($FindMonthlyExpenseTotalInput: FindMonthlyExpenseTotalInput!) {
    findMonthlyExpenseTotal(FindMonthlyExpenseTotalInput: $FindMonthlyExpenseTotalInput) {
      ok
      error
      months {
        year
        month
        totalAmount
      }
    }
  }
`;

export const FIND_CATEGORY_MONTHLY_EXPENSE_QUERY = `
  query FindCategoryMonthlyExpense($FindCategoryMonthlyExpenseInput: FindCategoryMonthlyExpenseInput!) {
    findCategoryMonthlyExpense(FindCategoryMonthlyExpenseInput: $FindCategoryMonthlyExpenseInput) {
      ok
      error
      result {
        year
        month
        categoryId
        categoryName
        totalAmount
      }
    }
  }
`;

export const FIND_SUMMARY_QUERY = `
  query FindSummary($FindSummaryInput: FindSummaryInput!) {
    findSummary(FindSummaryInput: $FindSummaryInput) {
      ok
      error
      summary {
        lastMonthExpense
        thisMonthExpense
        topCategory {
          id
          name
          totalExpense
        }
      }
    }
  }
`;

// ============ Budget Mutations & Queries ============
export const UPSERT_BUDGET_MUTATION = `
  mutation UpsertBudget($UpsertBudgetInput: UpsertBudgetInput!) {
    upsertBudget(UpsertBudgetInput: $UpsertBudgetInput) {
      ok
      error
      budget {
        id
        yearMonth
        totalAmount
      }
    }
  }
`;

export const FIND_BUDGETS_QUERY = `
  query FindBudgets($FindBudgetInput: FindBudgetInput!) {
    findBudgets(FindBudgetInput: $FindBudgetInput) {
      ok
      error
      budgets {
        id
        yearMonth
        totalAmount
        totalExpense
        category {
          id
          name
        }
      }
    }
  }
`;

export const DELETE_BUDGET_MUTATION = `
  mutation DeleteBudget($DeleteBudgetInput: DeleteBudgetInput!) {
    deleteBudget(DeleteBudgetInput: $DeleteBudgetInput) {
      ok
      error
    }
  }
`;
