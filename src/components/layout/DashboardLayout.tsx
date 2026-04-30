import { Link, useLocation } from "react-router-dom";
import { UserButton } from "@clerk/react";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  BarChart3, 
  Link2, 
  Settings,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Connections", href: "/connections", icon: Link2 },
  { name: "Collaborators", href: "/collaborators", icon: Settings },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#FDF8F8] flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-white h-16 flex items-center justify-between px-6 shrink-0 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2">
          <span className="font-heading text-lg font-black tracking-tighter text-[#18181B]">
            AdsAnalytics
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-[#71717A] h-9 w-9">
            <Bell className="h-5 w-5" />
          </Button>
          <UserButton />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-white flex flex-col pt-4 shrink-0 shadow-[1px_0px_0px_rgba(34,42,53,0.08)]">
          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive 
                      ? "bg-[#F4F4F5] text-[#18181B]" 
                      : "text-[#71717A] hover:text-[#18181B] hover:bg-gray-50"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", isActive ? "text-[#18181B]" : "text-[#71717A]")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-300 mx-auto py-12 px-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
