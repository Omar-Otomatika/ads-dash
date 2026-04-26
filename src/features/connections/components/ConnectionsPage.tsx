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
import { Trash2, Search, CircleFadingPlus,Link } from "lucide-react";

const platforms = [
  {
    id: "meta",
    name: "Meta Ads",
    description: "Connect Facebook and Instagram advertising accounts.",
    icon: CircleFadingPlus,
    color: "bg-[#f5f5f5]",
  },
  {
    id: "google",
    name: "Google Ads",
    description: "Import Search, Display, and Video campaign metrics.",
    icon: Search,
    color: "bg-[#f5f5f5]",
  },
  {
    id: "linkedin",
    name: "LinkedIn Ads",
    description: "Sync B2B audience targeting and lead gen data.",
    icon: Link ,
    color: "bg-[#f5f5f5]",
  },
];

const connectedAccounts = [
  {
    id: "1",
    platform: "Meta Ads Manager",
    email: "marketing@enterprise.com",
    icon: CircleFadingPlus ,
  },
  {
    id: "2",
    platform: "Google SEM Main",
    email: "admin@enterprise.com",
    icon: Search,
  },
  {
    id: "3",
    platform: "LinkedIn Sales Solutions",
    email: "social@enterprise.com",
    icon: Link,
  },
];

export function ConnectionsPage() {
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
        {platforms.map((platform) => (
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
            <Button className="w-full bg-[#242424] hover:bg-black text-white rounded-lg h-10 shadow-[inset_0px_2px_0px_0px_rgba(255,255,255,0.15)] font-medium">
              Connect
            </Button>
          </Card>
        ))}
      </div>

      {/* Connected Accounts */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-[#111111] tracking-tight">
          Connected Accounts
        </h2>
        <Card className="overflow-hidden border shadow-[0px_4px_8px_rgba(0,0,0,0.05),0px_0px_0px_1px_rgba(34,42,53,0.08)] rounded-xl">
          <Table>
            <TableHeader className="bg-[rgba(250,250,250,0.5)]">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="px-6 py-4 text-[11px] font-black text-[#71717A] tracking-[0.05em] uppercase">PLATFORM</TableHead>
                <TableHead className="px-6 py-4 text-[11px] font-black text-[#71717A] tracking-[0.05em] uppercase">EMAIL CONNECTED</TableHead>
                <TableHead className="px-6 py-4 text-[11px] font-black text-[#71717A] tracking-[0.05em] uppercase text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {connectedAccounts.map((account) => (
                <TableRow key={account.id} className="hover:bg-gray-50/50 border-b last:border-0 transition-colors">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-[#F4F4F5] rounded flex items-center justify-center shadow-[inset_0_0_0_1px_rgba(34,42,53,0.08)]">
                        <account.icon className="h-3.5 w-3.5 text-[#111111]" />
                      </div>
                      <span className="text-base font-medium text-[#111111]">{account.platform}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-base font-medium text-[#5E5E5E]">{account.email}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[#71717A] hover:text-red-600 hover:bg-red-50 transition-colors">
                      <Trash2 className="h-4.5 w-4.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
