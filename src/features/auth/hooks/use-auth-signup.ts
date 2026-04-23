import { useMutation } from "@tanstack/react-query";
import { useSignUp } from "@clerk/react";
import { authService, type SignUpParams } from "../services/auth.service";
import { isClerkAPIResponseError } from "@clerk/react/errors";

export function useAuthSignUp() {
  const { signUp, fetchStatus } = useSignUp();

  const isLoaded = fetchStatus !== undefined;

  const signUpMutation = useMutation({
    mutationFn: (params: SignUpParams) => {
      if (!signUp) throw new Error("Clerk not loaded");
      return authService.signUp(signUp, params);
    },
  });

  const verifyMutation = useMutation({
    mutationFn: (code: string) => {
      if (!signUp) throw new Error("Clerk not loaded");
      return authService.verifyEmail(signUp, code);
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => {
      if (!signUp) throw new Error("Clerk not loaded");
      return authService.resendCode(signUp);
    },
  });

  const getErrorMessage = (error: unknown) => {
    if (isClerkAPIResponseError(error)) {
      return error.errors[0]?.longMessage || "An error occurred";
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "An unexpected error occurred";
  };

  return {
    signUp: signUpMutation,
    verify: verifyMutation,
    resend: resendMutation,
    isLoaded,
    getErrorMessage,
  };
}
