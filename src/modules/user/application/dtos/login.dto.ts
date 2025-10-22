export interface ILoginInput {
  email: string;
  password: string;
}

export interface ILoginOutput {
  userId: number;
  token: string;
}
