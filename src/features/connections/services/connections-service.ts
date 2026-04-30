import api from "@/lib/api";
import { supabase } from "@/lib/supabase";

export interface CreateConnectionResponse {
  authUrl: string;
}

export interface AdsAccount {
  adsAccount: {
    id: string;
    accountName: string;
    accountId: string;
  };
}

export interface Connection {
  id: string;
  platform: string;
  adsAccounts: AdsAccount[];
}

export interface GetConnectionsResponse {
  success: boolean;
  count: number;
  data: Connection[];
}

export const connectionsService = {
  getConnections: async (userId: string): Promise<GetConnectionsResponse> => {
    const { data, error } = await supabase.functions.invoke('adlyfy-ads-connection', {
      method: 'GET',
      headers: {
        'x-user-id': userId
      }
    });

    if (error) {
      console.error("Edge Function error:", error);
      throw error;
    }

    return data;
  },
  createConnection: async (platform: string, redirect: string, userId: string): Promise<CreateConnectionResponse> => {
    const { data, error } = await supabase.functions.invoke('adlyfy-ads-connection', {
      body: { platform, redirect },
      headers: {
        'x-user-id': userId
      }
    });

    if (error) {
      console.error("Edge Function error:", error);
      throw error;
    }

    return data;
  },
  deleteConnection: async (connectionId: string, userId: string): Promise<{ success: boolean }> => {
    const { data, error } = await supabase.functions.invoke('adlyfy-ads-connection', {
      method: 'DELETE',
      headers: {
        'x-user-id': userId
      },
      body: { connectionId }
    });

    if (error) {
      console.error("Edge Function error:", error);
      throw error;
    }

    return data;
  },
};
