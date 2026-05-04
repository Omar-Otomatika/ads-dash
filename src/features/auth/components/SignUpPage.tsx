import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useSignUp } from "@clerk/react";
import { isClerkAPIResponseError } from "@clerk/react/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Loader2, Network } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";

const signUpSchema = z.object({
  accountType: z.enum(["branch", "agency"]),
  email_address: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const { signUp, fetchStatus, errors: clerkErrors } = useSignUp();
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
      email_address: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignUpValues) => {
    if (!signUp) return;
    setError("");

    try {
      await signUp.password({
        emailAddress: data.email_address,
        password: data.password,
        unsafeMetadata: {
          account_type: data.accountType,
        },
      });

      await signUp.verifications.sendEmailCode();
      setVerifying(true);
    } catch (err: any) {
      if (isClerkAPIResponseError(err)) {
        setError(err.errors[0]?.longMessage || "An error occurred.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;
    setError("");

    try {
      await signUp.verifications.verifyEmailCode({
        code,
      });

      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: (params) => {
            navigate(params.decorateUrl("/connections"));
          },
        });
      }
    } catch (err: any) {
      if (isClerkAPIResponseError(err)) {
        setError(err.errors[0]?.longMessage || "Invalid code.");
      } else {
        setError("Verification failed.");
      }
    }
  };

  const handleResend = async () => {
    if (!signUp) return;
    try {
      await signUp.verifications.sendEmailCode();
      setError("New code sent!");
    } catch (err: any) {
      setError("Failed to resend code.");
    }
  };

  // Combine manual error with Clerk's error object if present
  const displayError = error || (clerkErrors as any)?.message;

  if (verifying) {
    return (
      <div className="min-h-screen bg-background font-sans text-foreground flex flex-col items-center py-20 px-6">
        <Card className="w-full max-w-md p-10 border-none shadow-cal bg-card text-center">
          <h2 className="text-2xl font-semibold mb-4">Verify your email</h2>
          <p className="text-muted-foreground font-light mb-8 text-sm">
            We've sent a verification code to your email. Please enter it below.
          </p>
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="code" className="sr-only">
                Verification Code
              </Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="000000"
                className="bg-secondary border-none h-14 text-center text-2xl tracking-[0.5em] font-bold shadow-none focus-visible:ring-1"
                required
              />
            </div>
            {displayError && (
              <p
                className={cn(
                  "text-xs font-medium",
                  displayError.includes("sent")
                    ? "text-green-600"
                    : "text-destructive",
                )}
              >
                {displayError}
              </p>
            )}
            <Button
              type="submit"
              disabled={isFetching}
              className="w-full h-14 text-base font-medium shadow-cal-inset"
            >
              {isFetching ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Verify Email"
              )}
            </Button>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleResend}
                disabled={isFetching}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {isFetching ? "Sending..." : "I didn't receive a code. Resend"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setVerifying(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Back to Sign Up
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col items-center py-20 px-6">
      <div className="text-center max-w-2xl space-y-4 mb-16">
        <h1 className="text-5xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="text-muted-foreground font-light leading-relaxed">
          Join the world's most advanced analytics platform for performance
          marketing. Choose how you'll be using Adlytics.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl space-y-12"
      >
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
                <RadioGroupItem
                  value="agency"
                  id="agency"
                  className="sr-only"
                />
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
          <Card className="w-full max-w-md p-10 border-none shadow-cal bg-card">
            <h2 className="text-xl font-semibold mb-8 text-left">
              Account Details
            </h2>

            <div className="space-y-6 text-left">
              {displayError && (
                <p className="text-xs font-medium text-destructive">{displayError}</p>
              )}

              <div className="space-y-2 text-left">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <Controller
                  name="email_address"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-1">
                      <Input
                        {...field}
                        id="email"
                        placeholder="name@company.com"
                        className="bg-secondary border-none h-12 px-4 shadow-none focus-visible:ring-1"
                      />
                      {errors.email_address && (
                        <p className="text-[10px] font-medium text-destructive">
                          {errors.email_address.message}
                        </p>
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
                        className="bg-secondary border-none h-12 px-4 shadow-none focus-visible:ring-1"
                      />
                      {errors.password && (
                        <p className="text-[10px] font-medium text-destructive">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={isFetching}
                className="w-full h-14 text-base font-medium shadow-cal-inset"
              >
                {isFetching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>

            <footer className="mt-8 text-center text-sm font-light">
              Already have an account?{" "}
              <Link
                to="/sign-in"
                className="font-bold text-foreground hover:underline text-base ml-1"
              >
                Sign in
              </Link>
            </footer>
          </Card>
        </div>
      </form>
    </div>
  );
}

function AccountTypeCard({
  title,
  description,
  icon,
  selected,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
}) {
  return (
    <Card
      className={cn(
        "p-8 bg-card border-none shadow-cal transition-all relative overflow-hidden flex flex-col gap-6 h-full",
        selected ? "ring-2 ring-primary" : "hover:scale-[1.01]",
      )}
    >
      <div className="w-full aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
        <div className="bg-card p-4 rounded-lg shadow-sm border">{icon}</div>
      </div>
      <div className="space-y-3 pr-8 text-left">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-2xl font-semibold">{title}</h3>
        </div>
        <p className="text-sm font-light text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
      <div className="absolute bottom-6 right-6">
        <div
          className={cn(
            "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
            selected
              ? "bg-primary border-primary text-white"
              : "border-muted-foreground/30",
          )}
        >
          {selected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
      </div>
    </Card>
  );
}
