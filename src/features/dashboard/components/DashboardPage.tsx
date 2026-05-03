import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/hooks/use-auth-store";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard-service";
import { connectionsService } from "@/features/connections/services/connections-service";
import { Loader2, TrendingUp, MousePointer2, Eye, Calendar as CalendarIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { type DateRange } from "react-day-picker";
import { subDays, format } from "date-fns";

export function DashboardPage() {
  const userId = useAuthStore((state) => state.userId);
  
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Fetch connections to find the selected Google account ID
  const { data: connectionsData, isLoading: isLoadingConnections } = useQuery({
    queryKey: ['connections', userId],
    queryFn: () => userId ? connectionsService.getConnections(userId) : Promise.reject("No user ID"),
    enabled: !!userId,
  });

  // Get selected Google Ads account ID
  const selectedAccountId = useMemo(() => {
    if (!connectionsData?.data) return null;
    
    const saved = localStorage.getItem('selected_ads_accounts');
    if (!saved) return null;
    
    const map = JSON.parse(saved);
    
    // Find the connection that is Google
    const googleConnection = connectionsData.data.find(c => c.platform === 'google');
    if (!googleConnection) return null;
    
    const selectedId = map[googleConnection.id];
    if (!selectedId) return null;
    
    // Find the account to get the platform-native accountId
    const accountItem = googleConnection.adsAccounts.find(a => a.adsAccount.id === selectedId);
    return accountItem?.adsAccount.accountId || null;
  }, [connectionsData]);

  const { data: insightsData, isLoading: isLoadingInsights, error } = useQuery({
    queryKey: ['dashboard-insights', userId, selectedAccountId, date?.from, date?.to],
    queryFn: () => {
      if (!userId || !selectedAccountId || !date?.from || !date?.to) return Promise.reject("Missing context");
      return dashboardService.getInsights({
        platform: 'google',
        adAccountId: selectedAccountId,
        startDate: date.from.toISOString(),
        endDate: date.to.toISOString(),
        level: 'customer',
        fields: ['metrics.clicks', 'metrics.impressions', 'metrics.cost_micros'],
        userId
      });
    },
    enabled: !!userId && !!selectedAccountId && !!date?.from && !!date?.to,
  });

  const stats = useMemo(() => {
    if (!insightsData?.data) return null;
    const insights = Array.isArray(insightsData.data) ? insightsData.data[0] : insightsData.data;
    
    return {
      clicks: insights['metrics.clicks'] || insights.clicks || "0",
      impressions: insights['metrics.impressions'] || insights.impressions || "0",
      cost: (insights['metrics.cost_micros'] || insights.cost_micros) 
        ? (parseInt(insights['metrics.cost_micros'] || insights.cost_micros) / 1000000).toFixed(2) 
        : "0.00",
    };
  }, [insightsData]);

  const isLoading = isLoadingConnections || isLoadingInsights;

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!selectedAccountId && !isLoadingConnections) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
        <h2 className="text-xl font-semibold">No Google Ads Account Selected</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Please go to the Connections page to connect Google Ads and select an account to view statistics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <h1 className="text-[48px] font-semibold tracking-[-0.03em] text-[#111111] leading-[1.1]">
            Dashboard
          </h1>
          <p className="text-[18px] font-light text-[#5E5E5E] leading-relaxed max-w-2xl tracking-tight">
            Performance overview for your connected Google Ads account.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker date={date} setDate={setDate} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="border shadow-[0px_1px_2px_rgba(0,0,0,0.05),0px_0px_0px_1px_rgba(34,42,53,0.08)] rounded-[20px] bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-8 pt-8">
            <CardTitle className="text-sm font-black text-[#71717A] tracking-[0.08em] uppercase">
              Total Clicks
            </CardTitle>
            <MousePointer2 className="w-4 h-4 text-[#71717A]" />
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="text-[32px] font-semibold text-[#111111] tracking-tight">
              {stats?.clicks}
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-[0px_1px_2px_rgba(0,0,0,0.05),0px_0px_0px_1px_rgba(34,42,53,0.08)] rounded-[20px] bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-8 pt-8">
            <CardTitle className="text-sm font-black text-[#71717A] tracking-[0.08em] uppercase">
              Impressions
            </CardTitle>
            <Eye className="w-4 h-4 text-[#71717A]" />
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="text-[32px] font-semibold text-[#111111] tracking-tight">
              {stats?.impressions}
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-[0px_1px_2px_rgba(0,0,0,0.05),0px_0px_0px_1px_rgba(34,42,53,0.08)] rounded-[20px] bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-8 pt-8">
            <CardTitle className="text-sm font-black text-[#71717A] tracking-[0.08em] uppercase">
              Total Spend
            </CardTitle>
            <div className="text-[14px] font-bold text-[#71717A]">$</div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="text-[32px] font-semibold text-[#111111] tracking-tight">
              ${stats?.cost}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
