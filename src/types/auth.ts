export interface RegisterInput {
  email: string;
  username: string;
  password: string;
  roles?: string[];
}

export interface LoginInput {
  username: string;
  password: string;
  roles?: string[];
}
