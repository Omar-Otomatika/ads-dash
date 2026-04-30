import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSignIn } from "@clerk/react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/hooks/use-auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { isClerkAPIResponseError } from "@clerk/react/errors";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignInValues = z.infer<typeof signInSchema>;

const ASSETS = {
  ILLUSTRATION: "https://www.figma.com/api/mcp/asset/24cac811-e547-4be4-8222-bcb7ea17849a",
  GOOGLE_ICON: "https://www.figma.com/api/mcp/asset/ac681738-ab9e-439a-a49d-c63e06390bde",
};

export default function SignInPage() {
  const { signIn, fetchStatus } = useSignIn();
  const navigate = useNavigate();
  const setUserId = useAuthStore((state) => state.setUserId);

  const isFetching = fetchStatus === "fetching";

  const {
    control,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInValues) => {
    if (!signIn) return;

    try {
      const res = await signIn.password({
        identifier: data.email,
        password: data.password,
      });

      if (res.error) {
        setFormError("root", { message: res.error.message });
        return;
      }

      if (signIn.status === "complete") {
        console.log('sing-in res: ', res)
        if (res.createdUserId) {
          setUserId(res.createdUserId);
        }
        await signIn.finalize({
          navigate: (params) => {
            navigate(params.decorateUrl("/connections"));
          }
        });
      } else {
        console.log("Sign in status:", signIn.status);
      }
    } catch (err: any) {
      if (isClerkAPIResponseError(err)) {
        setFormError("root", { 
          message: err.errors[0]?.longMessage || "Invalid email or password." 
        });
      } else {
        setFormError("root", { message: "An unexpected error occurred." });
      }
    }
  };

  const handleGoogleSignIn = async () => {
    if (!signIn) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err: any) {
      console.error(err);
    }
  };

  if (!signIn) return null;

  return (
    <div className="flex min-h-screen w-full bg-white font-sans text-foreground">
      {/* Left Column: Brand & Visual */}
      <section className="hidden w-1/2 flex-col justify-between bg-[#fdf8f8] p-16 lg:flex">
        <div className="space-y-12">
          <Link to="/" className="font-heading text-xl font-black tracking-tighter uppercase inline-block text-foreground">
            ADLYTICS
          </Link>
          
          <div className="max-w-md space-y-6">
            <h1 className="font-heading text-5xl font-semibold leading-[1.1] tracking-tight">
              Turn complex data into clear outcomes.
            </h1>
            <p className="text-lg font-light text-muted-foreground leading-relaxed">
              The unified analytics platform for high-performance marketing teams.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-xl border bg-white p-1 shadow-cal text-left">
          <img 
            src={ASSETS.ILLUSTRATION} 
            alt="Data Visualization Interface" 
            className="w-full rounded-lg"
          />
        </div>
      </section>

      {/* Right Column: Sign In Form */}
      <section className="flex flex-1 items-center justify-center p-8">
        <Card className="w-full max-w-[440px] border-none p-12 shadow-cal bg-white">
          <div className="space-y-8">
            <header className="space-y-2 text-left">
              <h2 className="font-heading text-3xl font-semibold tracking-tight">Welcome back</h2>
              <p className="font-light text-muted-foreground">
                Enter your credentials to access your dashboard.
              </p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
              {errors.root && (
                <p className="text-xs font-medium text-destructive">{errors.root.message}</p>
              )}
              
              <div className="space-y-2 text-left">
                <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-1">
                      <Input
                        {...field}
                        id="email"
                        placeholder="name@company.com"
                        type="email"
                        className={cn(errors.email && "border-destructive ring-destructive/20")}
                      />
                      {errors.email && (
                        <p className="text-[10px] font-medium text-destructive">{errors.email.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <a href="#" className="text-xs font-medium text-blue-500 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-1">
                      <Input
                        {...field}
                        id="password"
                        placeholder="••••••••"
                        type="password"
                        className={cn(errors.password && "border-destructive ring-destructive/20")}
                      />
                      {errors.password && (
                        <p className="text-[10px] font-medium text-destructive">{errors.password.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isFetching}
                className="relative w-full h-12 text-base font-medium shadow-cal-inset"
              >
                {isFetching ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing In...</> : "Sign In"}
              </Button>
            </form>

            <div className="relative flex items-center justify-center">
              <Separator className="absolute w-full" />
              <span className="relative bg-white px-3 text-[10px] font-bold tracking-[0.1em] text-muted-foreground uppercase">
                OR CONTINUE WITH
              </span>
            </div>

            <Button 
              variant="outline" 
              className="w-full h-12 gap-3 text-base font-medium shadow-sm"
              onClick={handleGoogleSignIn}
            >
              <img src={ASSETS.GOOGLE_ICON} alt="" className="h-5 w-5" />
              Sign With Google
            </Button>

            <footer className="text-center text-sm font-medium text-muted-foreground">
              New to Adlytics?{" "}
              <Link to="/sign-up" className="font-bold text-foreground hover:underline">
                Create an account
              </Link>
            </footer>
          </div>
        </Card>
      </section>
    </div>
  );
}
