import { ArrowRight, Eye, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[440px] bg-white rounded-xl shadow-lg border border-muted p-8 space-y-8">
        {/* Logo and Header */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="flex items-center space-x-2">
            <div className="bg-primary p-2 rounded-lg">
              <Zap className="h-6 w-6 text-white fill-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-primary">AdsDash</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-sm text-foreground/60">
              Enter your credentials to access your dashboard
            </p>
          </div>
        </div>

        {/* Social Auth */}
        <Button variant="outline" className="w-full h-12 shadow-sm">
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 mr-2" />
          Google
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-white px-4 text-muted-foreground font-semibold tracking-wider">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <Input 
            label="Work Email" 
            placeholder="name@company.com" 
            type="email"
            id="email"
          />
          
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold tracking-wider text-foreground uppercase">
                Password
              </label>
              <button type="button" className="text-[10px] font-semibold text-primary hover:underline">
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                className="flex h-11 w-full rounded-md border border-muted bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>

          <Button className="w-full h-12 shadow-md shadow-primary/20" icon={ArrowRight}>
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center space-y-4">
          <p className="text-sm text-foreground/60 font-medium">
            Don't have an account?{' '}
            <button className="text-primary hover:underline font-bold">Sign up for free</button>
          </p>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            By clicking continue, you agree to our{' '}
            <button className="underline hover:text-foreground">Terms of Service</button> and{' '}
            <button className="underline hover:text-foreground">Privacy Policy</button>.
          </p>
        </div>
      </div>

      {/* External Links */}
      <div className="mt-8 flex items-center space-x-6 text-sm text-muted-foreground font-medium">
        <button className="hover:text-foreground">Support</button>
        <button className="hover:text-foreground">Documentation</button>
        <button className="hover:text-foreground">Status</button>
      </div>
    </div>
  );
}
