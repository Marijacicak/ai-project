export interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
  roles: string[];
}

export interface UserCreate {
  email: string;
  username: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
