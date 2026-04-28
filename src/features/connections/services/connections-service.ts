import api from "@/lib/api";

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
  createConnection: async (platform: string, redirect: string): Promise<CreateConnectionResponse> => {
    const response = await api.post<CreateConnectionResponse>('/connections', {
      platform,
      redirect,
    });
    return response.data;
  },
  deleteConnection: async (connectionId: string): Promise<{ success: boolean }> => {
    const response = await api.delete<{ success: boolean }>(`/connections/${connectionId}`);
    return response.data;
  },
};
