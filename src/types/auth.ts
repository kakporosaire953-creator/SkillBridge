export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    username?: string;
    account_type?: string;
    [key: string]: any;
  };
  app_metadata?: {
    [key: string]: any;
  };
  aud?: string;
  created_at?: string;
}

export interface Session {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  user: User;
}

export interface AuthChangeEvent {}
