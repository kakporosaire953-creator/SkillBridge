import { supabase, isSupabaseConfigured } from './supabase';
import { AccountType } from '../types';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

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
    if (!isSupabaseConfigured()) {
      return {
        user: null,
        session: null,
        error: 'Supabase n’est pas configuré. Veuillez renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: params.email.trim(),
        password: params.password,
        options: {
          data: {
            first_name: params.firstName.trim(),
            last_name: params.lastName.trim(),
            username: params.username.trim().toLowerCase(),
            account_type: params.accountType,
          },
        },
      });

      if (error) {
        return { user: null, session: null, error: error.message };
      }

      return { user: data.user, session: data.session, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de l’inscription.';
      return { user: null, session: null, error: msg };
    }
  },

  /**
   * Log in an existing user
   */
  async signIn(params: SignInParams): Promise<{ user: User | null; session: Session | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return {
        user: null,
        session: null,
        error: 'Supabase n’est pas configuré. Veuillez renseigner vos identifiants.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: params.email.trim(),
        password: params.password,
      });

      if (error) {
        return { user: null, session: null, error: error.message };
      }

      return { user: data.user, session: data.session, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la connexion.';
      return { user: null, session: null, error: msg };
    }
  },

  /**
   * Log out the current user and invalidate the session
   */
  async signOut(): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { error: null };
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la déconnexion.';
      return { error: msg };
    }
  },

  /**
   * Get active session
   */
  async getSession(): Promise<{ session: Session | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { session: null, error: null };
    }

    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        return { session: null, error: error.message };
      }
      return { session: data.session, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la récupération de la session.';
      return { session: null, error: msg };
    }
  },

  /**
   * Request password reset email
   */
  async resetPassword(email: string): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { error: 'Supabase n’est pas configuré.' };
    }

    try {
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : '';
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la demande de réinitialisation.';
      return { error: msg };
    }
  },

  /**
   * Update password for logged in user
   */
  async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { error: 'Supabase n’est pas configuré.' };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du mot de passe.';
      return { error: msg };
    }
  },

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    if (!isSupabaseConfigured()) {
      return { unsubscribe: () => {} };
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return {
      unsubscribe: () => subscription.unsubscribe(),
    };
  },
};
