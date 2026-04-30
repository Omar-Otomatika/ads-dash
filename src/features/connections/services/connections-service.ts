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
  getConnections: async (): Promise<GetConnectionsResponse> => {
    const response = await api.get<GetConnectionsResponse>('/connections');
    return response.data;
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
  deleteConnection: async (connectionId: string): Promise<{ success: boolean }> => {
    const response = await api.delete<{ success: boolean }>(`/connections/${connectionId}`);
    return response.data;
  },
};
