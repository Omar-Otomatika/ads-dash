import api from "@/lib/api";

export interface CreateConnectionResponse {
  authUrl: string;
}

export interface AdsAccount {
  id: string;
  name: string;
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
};
