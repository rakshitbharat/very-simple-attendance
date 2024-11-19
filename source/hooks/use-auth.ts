'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: number;
  email: string;
  name: string | null;
  is_admin: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const credentials = localStorage.getItem('credentials');
    if (!credentials) {
      setState({ user: null, isLoading: false, error: null });
      return;
    }

    try {
      const response = await fetch('/api/auth/check', {
        headers: {
          'Authorization': credentials,
        },
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      setState({ user: data.user, isLoading: false, error: null });
    } catch (error) {
      setState({ user: null, isLoading: false, error: 'Authentication failed' });
      localStorage.removeItem('credentials');
    }
  };

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.requiresPtp) {
        return { requiresPtp: true };
      }

      localStorage.setItem('credentials', `${email}|||${password}`);
      setState({ user: data.user, isLoading: false, error: null });
      toast({ title: 'Success', description: 'Logged in successfully' });
      router.push('/dashboard');
      return { requiresPtp: false };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setState(prev => ({ ...prev, isLoading: false, error: message }));
      toast({ title: 'Error', description: message, variant: 'destructive' });
      throw error;
    }
  };

  const validatePtp = async (ptp: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    const credentials = localStorage.getItem('credentials');

    if (!credentials) {
      setState(prev => ({ ...prev, isLoading: false, error: 'No credentials found' }));
      return;
    }

    try {
      const response = await fetch('/api/validate-ptp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': credentials,
        },
        body: JSON.stringify({ ptp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'PTP validation failed');
      }

      localStorage.setItem('credentials', `${credentials}|||${ptp}`);
      setState({ user: data.user, isLoading: false, error: null });
      toast({ title: 'Success', description: 'PTP validated successfully' });
      router.push('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'PTP validation failed';
      setState(prev => ({ ...prev, isLoading: false, error: message }));
      toast({ title: 'Error', description: message, variant: 'destructive' });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('credentials');
    setState({ user: null, isLoading: false, error: null });
    toast({ title: 'Success', description: 'Logged out successfully' });
    router.push('/');
  };

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    login,
    logout,
    validatePtp,
  };
}