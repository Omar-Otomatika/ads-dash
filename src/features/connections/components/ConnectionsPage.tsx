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
import { Trash2, Search, CircleFadingPlus, Link as LinkIcon, Loader2, Check } from "lucide-react";
import { connectionsService, type AdsAccount } from "../services/connections-service";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/hooks/use-auth-store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.userId);

  const [selectionDialogOpen, setSelectionDialogOpen] = useState(false);
  const [activeConnectionId, setActiveConnectionId] = useState<string | null>(null);
  const [availableAccounts, setAvailableAccounts] = useState<AdsAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");

  // Local state for UI persistence of selected accounts
  const [selectedAccountsMap, setSelectedAccountsMap] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('selected_ads_accounts');
    return saved ? JSON.parse(saved) : {};
  });

  const { data: connectionsData, isLoading } = useQuery({
    queryKey: ['connections', userId],
    queryFn: () => userId ? connectionsService.getConnections(userId) : Promise.reject("No user ID"),
    enabled: !!userId,
  });

  // Invalidate queries when returning from successful connection
  useEffect(() => {
    if (searchParams.get("connection") === "success") {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    }
  }, [searchParams, queryClient]);

  // Handle successful connection redirect
  useEffect(() => {
    const platform = searchParams.get("platform");
    if (searchParams.get("connection") === "success" && connectionsData?.data) {
      const connection = platform 
        ? connectionsData.data.find(c => c.platform === platform)
        : connectionsData.data[0];

      if (connection && connection.adsAccounts.length > 0) {
        setActiveConnectionId(connection.id);
        setAvailableAccounts(connection.adsAccounts);
        setSelectedAccountId(""); 
        setSelectionDialogOpen(true);
      }
      navigate("/connections", { replace: true });
    }
  }, [searchParams, connectionsData, navigate]);

  const deleteMutation = useMutation({
    mutationFn: (connectionId: string) => userId ? connectionsService.deleteConnection(connectionId, userId) : Promise.reject("No user ID"),
    onSuccess: (_, connectionId) => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      
      // Cleanup local mapping
      const newMap = { ...selectedAccountsMap };
      delete newMap[connectionId];
      setSelectedAccountsMap(newMap);
      localStorage.setItem('selected_ads_accounts', JSON.stringify(newMap));
      
      toast.success("Connection deleted successfully");
      setDeleteId(null);
    },
    onError: (error: any) => {
      console.error("Failed to delete connection:", error);
      const message = error.response?.data?.message || "Failed to delete connection";
      toast.error(message);
    },
  });

  const handleDelete = (connectionId: string) => {
    setDeleteId(connectionId);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  const handleSelectAccount = () => {
    if (!selectedAccountId || !activeConnectionId) {
      toast.error("Please select an account first");
      return;
    }
    
    const selected = availableAccounts.find(a => a.adsAccount.id === selectedAccountId);
    
    // Persist selection locally
    const newMap = { ...selectedAccountsMap, [activeConnectionId]: selectedAccountId };
    setSelectedAccountsMap(newMap);
    localStorage.setItem('selected_ads_accounts', JSON.stringify(newMap));

    toast.success("Account selected successfully", {
      description: `Targeting account: ${selected?.adsAccount.accountName}`
    });
    setSelectionDialogOpen(false);
    setActiveConnectionId(null);
  };

  const handleConnect = async (platformId: string) => {
    if (!userId) {
      toast.error("User session not found. Please sign in again.");
      return;
    }
    setConnectingId(platformId);
    try {
      const redirectPath = `${window.location.origin}/connections?platform=${platformId}`;
      const { authUrl } = await connectionsService.createConnection(platformId, redirectPath, userId);
      window.location.href = authUrl;
    } catch (error: any) {
      console.error(`Failed to connect to ${platformId}:`, error);
      const errorMessage = error.response?.data?.message || "Connection failed";
      const errorDetail = error.response?.data?.error;
      
      toast.error(errorMessage, {
        description: errorDetail,
      });
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
                  <TableHead className="px-6 py-4 text-[11px] font-black text-[#71717A] tracking-[0.05em] uppercase w-[100px]">PLATFORM</TableHead>
                  <TableHead className="px-6 py-4 text-[11px] font-black text-[#71717A] tracking-[0.05em] uppercase">ACCOUNT</TableHead>
                  <TableHead className="px-6 py-4 text-[11px] font-black text-[#71717A] tracking-[0.05em] uppercase text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {connectionsData?.data?.map((connection) => {
                  const config = platformConfig.find(p => p.id === connection.platform);
                  const Icon = config?.icon || LinkIcon;
                  
                  // Find selected account from map or fallback to first one
                  const selectedId = selectedAccountsMap[connection.id];
                  const accountItem = selectedId 
                    ? connection.adsAccounts.find(a => a.adsAccount.id === selectedId)
                    : connection.adsAccounts[0];
                  
                  const primaryAccount = accountItem?.adsAccount;

                  return (
                    <TableRow key={connection.id} className="hover:bg-gray-50/50 border-b last:border-0 transition-colors">
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-[#F4F4F5] rounded-lg flex items-center justify-center shadow-[inset_0_0_0_1px_rgba(34,42,53,0.08)]">
                            <Icon className="h-5 w-5 text-[#111111]" />
                          </div>
                          <span className="text-sm font-semibold text-[#111111] whitespace-nowrap">
                            {config?.name || connection.platform}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {primaryAccount ? (
                          <div className="flex flex-col">
                            <span className="text-base font-semibold text-[#111111]">
                              {primaryAccount.accountName}
                            </span>
                            <span className="text-xs text-[#71717A] font-mono">
                              ID: {primaryAccount.accountId}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-[#71717A] italic">No account selected</span>
                        )}
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

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Connection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this connection? This action will stop all active reporting and syncs for this platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Account Selection Dialog */}
      <Dialog open={selectionDialogOpen} onOpenChange={setSelectionDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Ad Account</DialogTitle>
            <DialogDescription>
              We found multiple accounts associated with your connection. Please select the primary account you want to track.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 max-h-[400px] overflow-y-auto px-1">
            <RadioGroup 
              value={selectedAccountId} 
              onValueChange={setSelectedAccountId}
              className="space-y-3"
            >
              {availableAccounts.map((item) => {
                const account = item.adsAccount;
                return (
                  <div 
                    key={account.id} 
                    className={`flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedAccountId === account.id 
                      ? "border-black bg-gray-50 ring-1 ring-black" 
                      : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedAccountId(account.id)}
                  >
                    <RadioGroupItem value={account.id} id={account.id} className="sr-only" />
                    <div className="flex-1">
                      <Label htmlFor={account.id} className="text-sm font-semibold cursor-pointer block">
                        {account.accountName}
                      </Label>
                      <span className="text-xs text-gray-500 font-mono">ID: {account.accountId}</span>
                    </div>
                    {selectedAccountId === account.id && (
                      <div className="h-5 w-5 rounded-full bg-black flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectionDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSelectAccount}
              disabled={!selectedAccountId}
              className="bg-[#242424] hover:bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Selection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
