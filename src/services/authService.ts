import { AccountType } from '../types';
import { User, Session, AuthChangeEvent } from '../types/auth';

export interface SignUpParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  accountType: AccountType;
}

export interface SignInParams {
  email: string;
  password: string;
}

export const AuthService = {
  /**
   * Register a new user with real Supabase Auth
   */
  async signUp(params: SignUpParams): Promise<{ user: User | null; session: Session | null; error: string | null }> {
        return {
                user: null,
                session: null,
                error: 'Supabase n’est pas configuré. Veuillez renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.',
              };
    },

  /**
   * Log in an existing user
   */
  async signIn(params: SignInParams): Promise<{ user: User | null; session: Session | null; error: string | null }> {
      return {
              user: null,
              session: null,
              error: 'Supabase n’est pas configuré. Veuillez renseigner vos identifiants.',
            };
  },

  /**
   * Log out the current user and invalidate the session
   */
  async signOut(): Promise<{ error: string | null }> {
      return { error: null };
  },

  /**
   * Get active session
   */
  async getSession(): Promise<{ session: Session | null; error: string | null }> {
      return { session: null, error: null };
  },

  /**
   * Request password reset email
   */
  async resetPassword(email: string): Promise<{ error: string | null }> {
      return { error: 'Supabase n’est pas configuré.' };
  },

  /**
   * Update password for logged in user
   */
  async updatePassword(newPassword: string): Promise<{ error: string | null }> {
      return { error: 'Supabase n’est pas configuré.' };
  },

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
      return { unsubscribe: () => {} };
  },
};
