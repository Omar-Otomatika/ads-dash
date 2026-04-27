import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Search, CircleFadingPlus, Link as LinkIcon, Loader2 } from "lucide-react";
import { connectionsService } from "../services/connections-service";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const platformConfig = [
  {
    id: "meta",
    name: "Meta Ads",
    description: "Connect Facebook and Instagram advertising accounts.",
    icon: CircleFadingPlus,
    color: "bg-[#f5f5f5]",
    isAvailable: true,
  },
  {
    id: "google",
    name: "Google Ads",
    description: "Import Search, Display, and Video campaign metrics.",
    icon: Search,
    color: "bg-[#f5f5f5]",
    isAvailable: true,
  },
  {
    id: "linkedin",
    name: "LinkedIn Ads",
    description: "Sync B2B audience targeting and lead gen data.",
    icon: LinkIcon,
    color: "bg-[#f5f5f5]",
    isAvailable: true,
  },
  {
    id: "tiktok",
    name: "TikTok Ads",
    description: "Sync B2B audience targeting and lead gen data.",
    icon: LinkIcon,
    color: "bg-[#f5f5f5]",
    isAvailable: false,
  },
];

export function ConnectionsPage() {
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: connectionsData, isLoading } = useQuery({
    queryKey: ['connections'],
    queryFn: () => connectionsService.getConnections(),
  });

  const deleteMutation = useMutation({
    mutationFn: (connectionId: string) => connectionsService.deleteConnection(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
    onError: (error) => {
      console.error("Failed to delete connection:", error);
      alert("Failed to delete connection. Please try again.");
    },
  });

  const handleDelete = async (connectionId: string) => {
    if (window.confirm("Are you sure you want to delete this connection?")) {
      deleteMutation.mutate(connectionId);
    }
  };

  const handleConnect = async (platformId: string) => {
    setConnectingId(platformId);
    try {
      const redirectPath = `${window.location.origin}/connections`;
      const { authUrl } = await connectionsService.createConnection(platformId, redirectPath);
      window.location.href = authUrl;
    } catch (error) {
      console.error(`Failed to connect to ${platformId}:`, error);
      setConnectingId(null);
    }
  };

  return (
    <div className="space-y-20">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-[48px] font-semibold tracking-[-0.03em] text-[#111111] leading-[1.1]">
          Connections
        </h1>
        <p className="text-[18px] font-light text-[#5E5E5E] leading-relaxed max-w-2xl tracking-tight">
          Integrate your advertising platforms to centralize your analytics and automate reporting performance across all channels.
        </p>
      </div>

      {/* Platform Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {platformConfig.map((platform) => {
          const isConnecting = connectingId === platform.id;
          const isConnected = connectionsData?.data?.some(c => c.platform === platform.id);

          return (
            <Card key={platform.id} className="p-6 flex flex-col items-center text-center border shadow-[0px_0px_0px_1px_rgba(34,42,53,0.08)] rounded-xl bg-white">
              <div className={platform.color + " h-16 w-16 rounded-full flex items-center justify-center mb-6 shadow-[inset_0_0_0_1px_rgba(34,42,53,0.08)]"}>
                <platform.icon className="h-6 w-6 text-[#1c1b1b]" />
              </div>
              <h3 className="text-2xl font-semibold text-[#1c1b1b] mb-1 tracking-tight">
                {platform.name}
              </h3>
              <p className="text-sm font-medium text-[#5E5E5E] mb-6 leading-relaxed px-4">
                {platform.description}
              </p>
              
              {!platform.isAvailable ? (
                <Button 
                  disabled
                  variant="outline"
                  className="w-full text-[#71717A] border-[#E4E4E7] bg-[#F4F4F5] rounded-lg h-10 font-medium cursor-not-allowed"
                >
                  Coming Soon
                </Button>
              ) : isConnected ? (
                <Button 
                  disabled
                  variant="outline"
                  className="w-full text-green-600 border-green-100 bg-green-50 rounded-lg h-10 font-medium cursor-default"
                >
                  Connected
                </Button>
              ) : (
                <Button 
                  onClick={() => handleConnect(platform.id)}
                  disabled={connectingId !== null}
                  className="w-full bg-[#242424] hover:bg-black text-white rounded-lg h-10 shadow-[inset_0px_2px_0px_0px_rgba(255,255,255,0.15)] font-medium"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect"
                  )}
                </Button>
              )}
            </Card>
          );
        })}
      </div>

      {/* Connected Accounts */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-[#111111] tracking-tight">
          Connected Accounts
        </h2>
        <Card className="overflow-hidden border shadow-[0px_4px_8px_rgba(0,0,0,0.05),0px_0px_0px_1px_rgba(34,42,53,0.08)] rounded-xl">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-[rgba(250,250,250,0.5)]">
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="px-6 py-4 text-[11px] font-black text-[#71717A] tracking-[0.05em] uppercase">PLATFORM</TableHead>
                  <TableHead className="px-6 py-4 text-[11px] font-black text-[#71717A] tracking-[0.05em] uppercase">ACCOUNT DETAILS</TableHead>
                  <TableHead className="px-6 py-4 text-[11px] font-black text-[#71717A] tracking-[0.05em] uppercase text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {connectionsData?.data?.map((connection) => {
                  const config = platformConfig.find(p => p.id === connection.platform);
                  const Icon = config?.icon || LinkIcon;

                  return (
                    <TableRow key={connection.id} className="hover:bg-gray-50/50 border-b last:border-0 transition-colors">
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-[#F4F4F5] rounded flex items-center justify-center shadow-[inset_0_0_0_1px_rgba(34,42,53,0.08)]">
                            <Icon className="h-3.5 w-3.5 text-[#111111]" />
                          </div>
                          <span className="text-base font-medium text-[#111111]">
                            {config?.name || connection.platform}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span className="text-base font-medium text-[#5E5E5E]">
                          {connection.adsAccounts.length} Ad Accounts Syncing
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(connection.id)}
                          disabled={deleteMutation.isPending}
                          className="h-8 w-8 text-[#71717A] hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          {deleteMutation.isPending && deleteMutation.variables === connection.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4.5 w-4.5" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {(!connectionsData?.data || connectionsData.data.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-12 text-muted-foreground font-light italic">
                      No accounts connected yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
}
