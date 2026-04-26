import api from "@/lib/api";

export interface TokenResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export const authService = {
  getTokens: async (externalUserId: string): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>('/auth/token', {
      externalUserId,
    });
    return response.data;
  },
};
