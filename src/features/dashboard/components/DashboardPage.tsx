import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/hooks/use-auth-store";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard-service";
import { connectionsService } from "@/features/connections/services/connections-service";
import { Loader2, TrendingUp, MousePointer2, Eye, Plus, Check, Settings2 } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { type DateRange } from "react-day-picker";
import { subDays, format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const AVAILABLE_METRICS = [
  { id: 'metrics.clicks', label: 'Clicks', icon: MousePointer2 },
  { id: 'metrics.impressions', label: 'Impressions', icon: Eye },
  { id: 'metrics.cost_micros', label: 'Spend', prefix: '$', isMicros: true },
  { id: 'metrics.conversions', label: 'Conversions', icon: TrendingUp },
  { id: 'metrics.ctr', label: 'CTR', suffix: '%' },
  { id: 'metrics.average_cpc', label: 'Avg. CPC', prefix: '$', isMicros: true },
  { id: 'metrics.conversions_from_interactions_rate', label: 'Conv. Rate', suffix: '%' },
];

const DEFAULT_METRICS = ['metrics.clicks', 'metrics.impressions', 'metrics.cost_micros'];

export function DashboardPage() {
  const userId = useAuthStore((state) => state.userId);
  
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(() => {
    const saved = localStorage.getItem('dashboard_selected_metrics');
    return saved ? JSON.parse(saved) : DEFAULT_METRICS;
  });

  const [tempMetrics, setTempMetrics] = useState<string[]>(selectedMetrics);

  useEffect(() => {
    localStorage.setItem('dashboard_selected_metrics', JSON.stringify(selectedMetrics));
  }, [selectedMetrics]);

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

  const { data: insightsData, isLoading: isLoadingInsights } = useQuery({
    queryKey: ['dashboard-insights', userId, selectedAccountId, date?.from, date?.to, selectedMetrics],
    queryFn: () => {
      if (!userId || !selectedAccountId || !date?.from || !date?.to) return Promise.reject("Missing context");
      return dashboardService.getInsights({
        platform: 'google',
        adAccountId: selectedAccountId,
        startDate: date.from.toISOString(),
        endDate: date.to.toISOString(),
        level: 'customer',
        fields: selectedMetrics,
        userId
      });
    },
    enabled: !!userId && !!selectedAccountId && !!date?.from && !!date?.to && selectedMetrics.length > 0,
  });

  const statsMap = useMemo(() => {
    if (!insightsData?.data) return {};
    const firstRow = Array.isArray(insightsData.data) ? insightsData.data[0] : insightsData.data;
    if (!firstRow) return {};
    
    // Google Ads API returns metrics inside a 'metrics' object
    return firstRow.metrics || firstRow;
  }, [insightsData]);

  const isLoading = isLoadingConnections || isLoadingInsights;

  const toggleMetric = (metricId: string) => {
    setTempMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const handleApplyMetrics = () => {
    setSelectedMetrics(tempMetrics);
  };

  if (isLoading && Object.keys(statsMap).length === 0) {
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
          <Dialog onOpenChange={(open) => open && setTempMetrics(selectedMetrics)}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-11 px-4 border-gray-200 rounded-xl bg-white hover:bg-gray-50 gap-2">
                <Settings2 className="w-4 h-4" />
                Customize Insights
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[24px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold">Customize Insights</DialogTitle>
                <DialogDescription>
                  Select the metrics you want to track on your dashboard.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {AVAILABLE_METRICS.map((metric) => (
                  <div key={metric.id} className="flex items-center space-x-3">
                    <Checkbox 
                      id={metric.id} 
                      checked={tempMetrics.includes(metric.id)}
                      onCheckedChange={() => toggleMetric(metric.id)}
                    />
                    <label
                      htmlFor={metric.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {metric.label}
                    </label>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button onClick={handleApplyMetrics} className="rounded-xl">Apply Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <DateRangePicker date={date} setDate={setDate} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {selectedMetrics.map((metricId) => {
          const metricConfig = AVAILABLE_METRICS.find(m => m.id === metricId);
          if (!metricConfig) return null;

          // Map metric ID to API response key
          // 1. Remove 'metrics.' prefix
          const apiKey = metricId.replace('metrics.', '');
          // 2. Convert snake_case to camelCase
          const camelKey = apiKey.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

          let rawValue = statsMap[camelKey] ?? statsMap[apiKey] ?? statsMap[metricId] ?? "0";
          
          let displayValue = rawValue;
          if (metricConfig.isMicros) {
            displayValue = (parseInt(rawValue.toString()) / 1000000).toFixed(2);
          } else if (metricConfig.suffix === '%') {
            displayValue = (parseFloat(rawValue.toString()) * 100).toFixed(2);
          } else if (typeof rawValue === 'number') {
            displayValue = rawValue.toLocaleString();
          }

          const Icon = metricConfig.icon;

          return (
            <Card key={metricId} className="border shadow-[0px_1px_2px_rgba(0,0,0,0.05),0px_0px_0px_1px_rgba(34,42,53,0.08)] rounded-[20px] bg-white overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-8 pt-8">
                <CardTitle className="text-sm font-black text-[#71717A] tracking-[0.08em] uppercase">
                  {metricConfig.label}
                </CardTitle>
                {Icon ? (
                  <Icon className="w-4 h-4 text-[#71717A]" />
                ) : (
                  <span className="text-[14px] font-bold text-[#71717A]">
                    {metricConfig.prefix || metricConfig.suffix || '#'}
                  </span>
                )}
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="text-[32px] font-semibold text-[#111111] tracking-tight">
                  {metricConfig.prefix}{displayValue}{metricConfig.suffix}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {selectedMetrics.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-100 rounded-[32px] bg-gray-50/50">
          <p className="text-muted-foreground">No insights selected. Click "Customize Insights" to add metrics.</p>
        </div>
      )}
    </div>
  );
}
