import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';   
import { useUserStore } from '../store/userStore';

export function InitSession() {
  const setSession = useUserStore((state) => state.setSession);

  useEffect(() => {
    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session);
      }
    }
    loadSession();
  }, [setSession]);

  return null;
}