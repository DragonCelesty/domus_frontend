import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    return !error;
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    return !error;
  };

  const setAuthData = (authData: any) => {
    // This function can be used to store authentication data in local storage or context
    // For example, you might want to store the session or user data
    localStorage.setItem('authData', JSON.stringify(authData));
  }
  return { login, register, loading, error, setAuthData };
}