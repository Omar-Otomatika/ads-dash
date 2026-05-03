import { supabase } from "@/lib/supabase";

export interface DashboardInsightsParams {
  platform: string;
  adAccountId: string;
  startDate: string;
  endDate: string;
  level?: string;
  fields?: string[];
  userId: string;
}

export interface GoogleInsightsData {
  clicks?: string;
  impressions?: string;
  cost_micros?: string;
  conversions?: string;
  [key: string]: any;
}

export interface DashboardInsightsResponse {
  success: boolean;
  data: GoogleInsightsData | GoogleInsightsData[];
  message?: string;
}

export const dashboardService = {
  getInsights: async (params: DashboardInsightsParams): Promise<DashboardInsightsResponse> => {
    const { platform, adAccountId, startDate, endDate, level, fields, userId } = params;
    
    const queryParams = new URLSearchParams({
      platform,
      adAccountId,
      startDate,
      endDate,
    });

    if (level) {
      queryParams.append("level", level);
    }
    
    if (fields && fields.length > 0) {
      queryParams.append("fields", fields.join(","));
    }

    const { data, error } = await supabase.functions.invoke(`adlyfy-insights?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'x-user-id': userId
      }
    });

    if (error) {
      console.error("Dashboard insights error:", error);
      throw error;
    }

    return data;
  }
};
