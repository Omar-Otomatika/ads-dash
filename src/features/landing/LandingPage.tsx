import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const imgAnalyticsDashboardPreview = "https://www.figma.com/api/mcp/asset/6489cb75-e009-48ad-8788-b630ae5ab4bc";
const imgCreativeAnalytics = "https://www.figma.com/api/mcp/asset/df490e16-e922-4e82-bf63-1225940d2d5d";
const imgArrowRight = "https://www.figma.com/api/mcp/asset/55ef19cf-678d-46bd-98d4-e84e7556fd80";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link to="/" className="font-heading text-xl font-black tracking-tighter uppercase">
              ADLYTICS
            </Link>
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent font-medium text-muted-foreground hover:text-foreground")}>
                    Platform
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent font-medium text-muted-foreground hover:text-foreground")}>
                    Solutions
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent font-medium text-muted-foreground hover:text-foreground")}>
                    Pricing
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent font-medium text-muted-foreground hover:text-foreground")}>
                    Resources
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
              <Link to="/sign-in">Sign In</Link>
            </Button>
            <Button asChild className="rounded-lg px-5">
              <Link to="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-32">
        {/* Hero Section */}
        <section className="container mx-auto flex max-w-7xl flex-col items-center px-6 text-center">
          <h1 className="max-w-4xl font-heading text-5xl font-semibold leading-[1.1] tracking-[-0.04em] sm:text-6xl md:text-7xl">
            Ads Analytics for High-Growth Teams
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-light text-muted-foreground leading-relaxed tracking-tight">
            Consolidate your marketing spend, track real-time performance, and unlock AI-driven insights without the complexity of traditional BI tools.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="relative shadow-cal-inset h-12 px-8 text-base">
              <Link to="/sign-up">Start Your Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base shadow-sm">
              Book a Demo
            </Button>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-20 w-full max-w-5xl rounded-xl border bg-card p-2 shadow-cal overflow-hidden">
            <img 
              src={imgAnalyticsDashboardPreview} 
              alt="Adlytics Dashboard Preview" 
              className="w-full rounded-lg"
            />
          </div>
        </section>

        {/* Trust Bar */}
        <section className="mt-24 border-y py-16">
          <div className="container mx-auto max-w-7xl px-6 text-center">
            <p className="text-[12px] font-medium tracking-widest text-muted-foreground/60 uppercase">
              Trusted by leading marketing organizations
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-20 gap-y-10 opacity-40 grayscale transition-all hover:grayscale-0">
              <span className="font-heading text-2xl font-black italic tracking-tighter">STRIPE</span>
              <span className="font-heading text-2xl font-black tracking-tighter">LINEAR</span>
              <span className="font-heading text-2xl font-black italic tracking-tighter">VERCEL</span>
              <span className="font-heading text-2xl font-black tracking-tighter">COINBASE</span>
              <span className="font-heading text-2xl font-black italic tracking-tighter">FRAMER</span>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto mt-24 max-w-7xl px-6 pb-24">
          <div className="text-center">
            <h2 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">
              Precision Engineered Insights
            </h2>
            <p className="mt-4 text-lg font-light text-muted-foreground">
              Stop guessing which ads work. Adlytics provides a unified source of truth for your growth engine.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Real-time tracking",
                desc: "Experience sub-second latency in data synchronization across all your active campaigns and ad sets.",
                icon: "⚡",
              },
              {
                title: "Multi-platform sync",
                desc: "Native connectors for Meta, Google, TikTok, and LinkedIn. Unified metrics in one central dashboard.",
                icon: "🔄",
              },
              {
                title: "AI Insights",
                desc: "Our proprietary algorithms identify waste and suggest budget reallocations based on historical performance.",
                icon: "✨",
              },
            ].map((f, i) => (
              <Card key={i} className="border-none bg-card p-8 shadow-cal transition-transform hover:-translate-y-1">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-xl">
                  {f.icon}
                </div>
                <h3 className="font-heading text-2xl font-semibold">{f.title}</h3>
                <p className="mt-3 font-light leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Bento Highlight */}
        <section className="container mx-auto mb-32 grid max-w-6xl gap-6 px-6 md:grid-cols-12">
          <Card className="flex flex-col justify-between overflow-hidden border-none shadow-cal md:col-span-8 p-10">
            <div>
              <h2 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">Deep Visibility</h2>
              <p className="mt-4 max-w-md font-light text-muted-foreground">
                Drill down into creative-level analytics. Understand not just what's converting, but why.
              </p>
            </div>
            <div className="mt-12 rounded-lg shadow-2xl overflow-hidden border">
               <img src={imgCreativeAnalytics} alt="Creative Analytics" className="w-full" />
            </div>
          </Card>
          
          <div className="flex flex-col justify-center rounded-xl bg-primary p-10 text-primary-foreground md:col-span-4 shadow-cal">
            <h3 className="font-heading text-2xl font-semibold">Scale Confidently</h3>
            <p className="mt-4 font-light opacity-80 leading-relaxed">
              Built for teams managing $10k to $10M in monthly spend. Robust security and enterprise-grade SLA included.
            </p>
            <a href="#" className="mt-6 flex items-center gap-2 text-sm font-medium hover:underline">
              Learn about security
              <img src={imgArrowRight} alt="" className="h-4 w-4 invert" />
            </a>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto mb-48 max-w-6xl px-6">
          <div className="flex flex-col items-center rounded-3xl bg-[#f1edec] py-20 px-10 text-center shadow-cal relative overflow-hidden">
             {/* Subtle shadow-border overlay like in Figma */}
            <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_0_1px_rgba(34,42,53,0.08)] pointer-events-none" />
            
            <h2 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">
              Ready to maximize your ROAS?
            </h2>
            <p className="mt-6 max-w-xl text-lg font-light text-muted-foreground">
              Join over 2,000+ high-growth marketing teams today. No credit card required to start.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="h-14 px-10 text-lg shadow-lg">
                <Link to="/sign-up">Get Started Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg shadow-sm">Talk to Sales</Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 md:flex-row">
          <div className="flex flex-col gap-2">
            <span className="font-heading text-lg font-extrabold tracking-tighter uppercase">ADLYTICS</span>
            <p className="text-sm font-medium text-muted-foreground">
              © 2024 Adlytics Analytics Inc. All rights reserved.
            </p>
          </div>
          <nav className="flex gap-8 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-foreground">Product</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">API</a>
            <a href="#" className="hover:text-foreground">Status</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
