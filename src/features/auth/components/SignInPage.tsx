import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

const ASSETS = {
  LOGO: "https://www.figma.com/api/mcp/asset/ef447ca9-a24e-4be0-9e32-1af1668d4651",
  STAR: "https://www.figma.com/api/mcp/asset/f45be972-f1b4-4596-a093-571416471a3e",
  GOOGLE: "https://www.figma.com/api/mcp/asset/a89d7555-2a1a-4bc9-a33a-bea0fae1da94",
  EXECUTIVE: "https://www.figma.com/api/mcp/asset/2826d146-52e7-4a14-84c5-4e5c09d2f0e8",
  EYE: "https://www.figma.com/api/mcp/asset/34beabfc-fce8-4399-b526-760490c995fe",
};

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-surface font-sans text-on-surface lg:flex-row">
      {/* Left Side: Visual/Editorial Section */}
      <section className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-primary p-16 lg:flex">
        {/* Architectural Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#161e31] to-[#2b3347]" />
        
        {/* Background Blurs */}
        <div className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-secondary opacity-10 blur-[50px]" />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#100071] opacity-20 blur-[40px]" />

        <div className="relative z-10 space-y-24">
          {/* Branding */}
          <div className="flex items-center gap-3">
            <img src={ASSETS.LOGO} alt="" className="h-6 w-6" />
            <h1 className="font-heading text-2xl font-extrabold tracking-[-0.6px] text-white uppercase">
              THE ANALYTICAL ATELIER
            </h1>
          </div>

          <div className="max-w-xl space-y-12">
            <div className="space-y-6">
              <span className="inline-block rounded-xl bg-secondary/20 px-3 py-1 text-[10px] font-semibold tracking-[2px] text-[#89f5e7] uppercase">
                EDITORIAL PRECISION
              </span>
              <h2 className="font-heading text-5xl font-extrabold leading-[1.2] tracking-[-1.2px] text-white">
                Transform raw data<br />
                into <span className="text-[#89f5e7]">architectural</span><br />
                insight.
              </h2>
            </div>

            {/* Testimonial Card (Glassmorphism) */}
            <div className="glass relative space-y-6 rounded-lg border border-white/10 p-8 shadow-2xl shadow-on-surface/20">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <img key={i} src={ASSETS.STAR} alt="" className="h-3 w-3" />
                ))}
              </div>
              <blockquote className="font-sans text-lg italic leading-relaxed text-[#939bb4]">
                "The level of sophisticated curation provided by the Atelier has reduced our cognitive load by half. It's not just a dashboard; it's a strategic environment."
              </blockquote>
              <div className="flex items-center gap-4 pt-2">
                <div className="relative h-12 w-12 overflow-hidden rounded-xl">
                  <img src={ASSETS.EXECUTIVE} alt="Marcus Vane" className="h-full w-full object-cover grayscale" />
                </div>
                <div>
                  <p className="font-heading text-sm font-bold text-white">Marcus Vane</p>
                  <p className="text-[10px] font-medium tracking-[1.2px] text-[#939bb4] uppercase">
                    CHIEF STRATEGY OFFICER, GLOBAL FLOW
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Legal */}
        <div className="relative z-10 pt-12">
          <p className="text-[10px] font-medium tracking-[2.4px] text-[#939bb4] uppercase">
            © 2024 ANALYTICAL ATELIER. ALL RIGHTS RESERVED.
          </p>
        </div>
      </section>

      {/* Right Side: Login Form */}
      <section className="flex flex-[1.2] items-center justify-center bg-surface p-8 lg:p-20">
        <div className="w-full max-w-md space-y-10 pt-10">
          <header className="space-y-3">
            <h3 className="font-heading text-3xl font-extrabold tracking-[-0.75px] text-primary">
              Welcome Back
            </h3>
            <p className="text-base text-on-surface-variant">
              Enter your credentials to access your workspace.
            </p>
          </header>

          <div className="space-y-6">
            {/* Social Login */}
            <Button 
              variant="outline" 
              className="h-12 w-full justify-center gap-3 border-none bg-surface-container-low font-semibold text-primary shadow-none transition-all hover:bg-surface-container-low/80"
            >
              <img src={ASSETS.GOOGLE} alt="" className="h-5 w-5" />
              Google
            </Button>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full border-outline-variant/30" />
              </div>
              <div className="relative flex justify-center uppercase">
                <span className="bg-surface px-2 text-[10px] font-semibold tracking-[1.2px] text-on-surface-variant">
                  OR CONTINUE WITH
                </span>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-semibold tracking-[1.2px] text-on-surface-variant uppercase">
                  EMAIL ADDRESS
                </Label>
                <div className="relative">
                  <Input 
                    id="email" 
                    placeholder="name@company.com" 
                    className="h-14 rounded-lg border-x-0 border-t-0 border-b border-[#6b7280] bg-white px-4 text-base font-medium placeholder:text-[#737780] focus-visible:ring-0 focus-visible:border-secondary focus-visible:border-b-2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[10px] font-semibold tracking-[1.2px] text-on-surface-variant uppercase">
                    PASSWORD
                  </Label>
                  <a href="#" className="text-[11px] font-semibold text-secondary hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <InputGroup className="h-14 rounded-lg border-x-0 border-t-0 border-b border-[#6b7280] bg-white px-4 has-[[data-slot=input-group-control]:focus-visible]:border-b-2 has-[[data-slot=input-group-control]:focus-visible]:border-secondary has-[[data-slot=input-group-control]:focus-visible]:ring-0 shadow-none transition-all">
                  <InputGroupInput 
                    id="password" 
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"} 
                    className="h-full px-0 text-base font-medium placeholder:text-[#737780]"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton 
                      onClick={() => setShowPassword(!showPassword)}
                      className="hover:bg-transparent"
                    >
                      <img src={ASSETS.EYE} alt="Toggle visibility" className={cn("h-4 w-4 transition-opacity", showPassword ? "opacity-100" : "opacity-50")} />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox id="remember" className="rounded-sm border-outline-variant" />
                <Label htmlFor="remember" className="text-sm font-medium text-on-surface-variant">
                  Remember me for 30 days
                </Label>
              </div>

              <Button className="h-14 w-full rounded-lg bg-gradient-to-r from-primary to-primary-container text-sm font-bold tracking-[0.35px] text-white shadow-xl shadow-primary/10 transition-all hover:opacity-90 active:scale-[0.98] uppercase">
                SIGN IN TO ATELIER
              </Button>
            </form>
          </div>

          {/* Bottom Nav */}
          <div className="flex flex-col items-center space-y-6 pt-10">
            <p className="text-sm text-on-surface-variant">
              Don't have an account yet?{" "}
              <a href="#" className="inline-block border-b-2 border-secondary font-bold text-primary transition-all hover:text-secondary">
                Request Access
              </a>
            </p>

            <nav className="flex gap-6 pt-10 lg:absolute lg:bottom-8 lg:right-8">
              {['PRIVACY', 'TERMS', 'SECURITY'].map((link) => (
                <a 
                  key={link} 
                  href="#" 
                  className="text-[10px] font-semibold tracking-[2px] text-[#737780] transition-colors hover:text-primary uppercase"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>
    </div>
  );
}
