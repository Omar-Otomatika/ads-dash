import { supabase } from './supabase';
import { useAuthStore } from '@/hooks/use-auth-store';

/**
 * Proxy-based API client for Adlyfy.
 * Resolves CORS and secures API keys via Supabase Edge Functions.
 */
const api = {
  // Helper to get headers for the Edge Function call
  _getInvokeOptions: (method: string, path: string, payload?: any) => {
    const state = useAuthStore.getState();
    const clerkToken = state.clerkToken;
    const adlyfyToken = state.accessToken;

    return {
      headers: clerkToken ? { Authorization: `Bearer ${clerkToken}` } : {},
      body: { 
        method, 
        path, 
        accessToken: adlyfyToken, // Pass Adlyfy token to proxy
        ...payload 
      }
    };
  },

  get: async <T>(path: string, config?: any): Promise<{ data: T }> => {
    const { data, error } = await supabase.functions.invoke(
      'adlyfy-proxy', 
      api._getInvokeOptions('GET', path, { params: config?.params })
    );
    if (error) throw error;
    return { data: data as T };
  },

  post: async <T>(path: string, body?: any, config?: any): Promise<{ data: T }> => {
    const { data, error } = await supabase.functions.invoke(
      'adlyfy-proxy', 
      api._getInvokeOptions('POST', path, { data: body, params: config?.params })
    );
    if (error) throw error;
    return { data: data as T };
  },

  put: async <T>(path: string, body?: any, config?: any): Promise<{ data: T }> => {
    const { data, error } = await supabase.functions.invoke(
      'adlyfy-proxy', 
      api._getInvokeOptions('PUT', path, { data: body, params: config?.params })
    );
    if (error) throw error;
    return { data: data as T };
  },

  delete: async <T>(path: string, config?: any): Promise<{ data: T }> => {
    const { data, error } = await supabase.functions.invoke(
      'adlyfy-proxy', 
      api._getInvokeOptions('DELETE', path, { params: config?.params })
    );
    if (error) throw error;
    return { data: data as T };
  },
};

export default api;
