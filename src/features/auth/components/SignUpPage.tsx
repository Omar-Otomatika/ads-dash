import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSignUp } from "@clerk/react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Building2, Network, Loader2 } from "lucide-react";

const signUpSchema = z.object({
  accountType: z.enum(["branch", "agency"]),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const { signUp, fetchStatus } = useSignUp();
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isFetching = fetchStatus === "fetching";

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      accountType: "branch",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignUpValues) => {
    if (!signUp) return;
    setError("");

    try {
      const res = await signUp.password({
        emailAddress: data.email,
        password: data.password,
      });

      if (res.error) {
         setError(res.error.message);
         return;
      }

      // Metadata handling in v6 might be different, but typically it's part of the user object after verification or via update
      // For now, let's proceed with verification
      await signUp.verifications.sendEmailCode();
      setVerifying(true);
    } catch (err: any) {
      console.error(err);
      setError("An unexpected error occurred during sign up.");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;
    setError("");

    try {
      const res = await signUp.verifications.verifyEmailCode({
        code,
      });

      if (res.error) {
        setError(res.error.message);
        return;
      }

      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: (params) => {
            navigate(params.decorateUrl("/"));
          }
        });
      } else {
        setError("Sign up could not be completed.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Invalid verification code.");
    }
  };

  const resendCode = async () => {
    if (!signUp) return;
    try {
      await signUp.verifications.sendEmailCode();
      setError("New code sent!");
    } catch (err: any) {
      setError("Failed to resend code.");
    }
  };

  if (!signUp) return null;

  if (verifying) {
    return (
      <div className="min-h-screen bg-[#fdf8f8] font-sans text-foreground flex flex-col items-center py-20 px-6">
        <Card className="w-full max-w-md p-10 border-none shadow-cal bg-white text-center">
          <h2 className="font-heading text-2xl font-semibold mb-4">Verify your email</h2>
          <p className="text-muted-foreground font-light mb-8 text-sm">
            We've sent a verification code to your email. Please enter it below.
          </p>
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="code" className="sr-only">Verification Code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="000000"
                className="bg-[#f5f5f5] border-none h-14 text-center text-2xl tracking-[0.5em] font-bold shadow-none focus-visible:ring-1"
                required
              />
            </div>
            {error && (
              <p className={cn(
                "text-xs font-medium",
                error.includes("sent") ? "text-green-600" : "text-destructive"
              )}>
                {error}
              </p>
            )}
            <Button type="submit" disabled={isFetching} className="w-full h-14 text-base font-medium shadow-cal-inset">
              {isFetching ? <Loader2 className="animate-spin" /> : "Verify Email"}
            </Button>
            <div className="flex flex-col gap-2">
              <Button type="button" variant="ghost" onClick={resendCode} className="text-xs text-muted-foreground hover:text-foreground">
                I didn't receive a code. Resend
              </Button>
              <Button type="button" variant="ghost" onClick={() => setVerifying(false)} className="text-xs text-muted-foreground hover:text-foreground">
                Back to Sign Up
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f8] font-sans text-foreground flex flex-col items-center py-20 px-6">
      <div className="text-center max-w-2xl space-y-4 mb-16">
        <h1 className="font-heading text-5xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-muted-foreground font-light leading-relaxed">
          Join the world's most advanced analytics platform for performance marketing. Choose how you'll be using Adlytics.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-4xl space-y-12">
        <Controller
          name="accountType"
          control={control}
          render={({ field }) => (
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid md:grid-cols-2 gap-6"
            >
              <div>
                <RadioGroupItem value="branch" id="branch" className="sr-only" />
                <Label htmlFor="branch" className="cursor-pointer h-full block">
                  <AccountTypeCard
                    title="Branch"
                    description="Perfect for individual businesses managing their own locations, local SEO, and branch-specific performance tracking."
                    icon={<Building2 className="w-6 h-6" />}
                    selected={field.value === "branch"}
                  />
                </Label>
              </div>
              <div>
                <RadioGroupItem value="agency" id="agency" className="sr-only" />
                <Label htmlFor="agency" className="cursor-pointer h-full block">
                  <AccountTypeCard
                    title="Agency"
                    description="Designed for marketing agencies managing multiple clients, complex permissions, and cross-account reporting."
                    icon={<Network className="w-6 h-6" />}
                    selected={field.value === "agency"}
                  />
                </Label>
              </div>
            </RadioGroup>
          )}
        />

        <div className="flex justify-center">
          <Card className="w-full max-w-md p-10 border-none shadow-cal bg-white">
            <h2 className="font-heading text-xl font-semibold mb-8 text-left">Account Details</h2>
            
            <div className="space-y-6 text-left">
              {error && <p className="text-xs font-medium text-destructive">{error}</p>}
              
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
                        className="bg-[#f5f5f5] border-none h-12 px-4 shadow-none focus-visible:ring-1"
                      />
                      {errors.email && (
                        <p className="text-[10px] font-medium text-destructive">{errors.email.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="password">Password</Label>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-1 text-left">
                      <Input
                        {...field}
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="bg-[#f5f5f5] border-none h-12 px-4 shadow-none focus-visible:ring-1"
                      />
                      {errors.password && (
                        <p className="text-[10px] font-medium text-destructive">{errors.password.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="flex items-start space-x-3 py-2 text-left">
                <Checkbox id="terms" className="mt-1" required />
                <Label htmlFor="terms" className="text-sm font-light leading-snug cursor-pointer">
                  I agree to the <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
                </Label>
              </div>

              <Button type="submit" disabled={isFetching} className="w-full h-14 text-base font-medium shadow-cal-inset">
                {isFetching ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : "Create Account"}
              </Button>
            </div>

            <footer className="mt-8 text-center text-sm font-light">
              Already have an account? <Link to="/sign-in" className="font-bold text-foreground hover:underline">Sign in</Link>
            </footer>
          </Card>
        </div>
      </form>
    </div>
  );
}

function AccountTypeCard({ title, description, icon, selected }: { title: string; description: string; icon: React.ReactNode; selected: boolean; }) {
  return (
    <Card className={cn("p-8 bg-white border-none shadow-cal transition-all relative overflow-hidden flex flex-col gap-6 h-full", selected ? "ring-2 ring-primary" : "hover:scale-[1.01]")}>
      <div className="w-full aspect-[4/3] bg-[#e5e5e5] rounded-lg flex items-center justify-center">
         <div className="bg-white p-4 rounded-lg shadow-sm border">{icon}</div>
      </div>
      <div className="space-y-3 pr-8 text-left">
        <div className="flex items-center gap-2">{icon}<h3 className="font-heading text-2xl font-semibold">{title}</h3></div>
        <p className="text-sm font-light text-muted-foreground leading-relaxed">{description}</p>
      </div>
      <div className="absolute bottom-6 right-6">
        <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center transition-colors", selected ? "bg-primary border-primary text-white" : "border-muted-foreground/30")}>
          {selected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
      </div>
    </Card>
  );
}
