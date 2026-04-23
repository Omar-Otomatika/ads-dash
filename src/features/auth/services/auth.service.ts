import type { SignUpResource } from "@clerk/react/types";

export type AccountType = "brand" | "agency";

export interface SignUpParams {
  email: string;
  password: string;
  unsafeMetadata: Record<string, string>;
}


export const authService = {
  async signUp(signUp: any, {email, password, unsafeMetadata}: SignUpParams): Promise<SignUpResource> {
    await signUp.create({
      emailAddress: email,
      password: password,
      unsafeMetadata,
    });

    await signUp.verifications.sendEmailCode();
    return signUp;
  },

  async verifyEmail(signUp: any, code: string): Promise<SignUpResource> {
    const res = await signUp.verifications.verifyEmailCode({
        code,
      });
      console.log("======from verifyEmail: ", res)
    return res;
  },

  async resendCode(signUp: any): Promise<void> {
    await signUp.verifications.sendEmailCode();
  },
};
