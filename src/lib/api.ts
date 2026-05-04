// import { supabase } from './supabase';

/**
 * specialized API client for Adlyfy.
 * Uses specialized Edge Functions per feature.
 * The generic 'adlyfy-proxy' has been removed.
 */
const api = {
  get: async <T>(_path: string, _config?: any): Promise<{ data: T }> => {
    // TODO: Implement specialized getters (e.g., supabase.functions.invoke('adlyfy-get-connections'))
    throw new Error("Generic GET proxy removed. Use specialized services.");
  },

  post: async <T>(_path: string, _body?: any, _config?: any): Promise<{ data: T }> => {
    throw new Error("Generic POST proxy removed. Use specialized services.");
  },

  put: async <T>(_path: string, _body?: any, _config?: any): Promise<{ data: T }> => {
    throw new Error("Generic PUT proxy removed. Use specialized services.");
  },

  delete: async <T>(_path: string, _config?: any): Promise<{ data: T }> => {
    throw new Error("Generic DELETE proxy removed. Use specialized services.");
  },
};

export default api;
