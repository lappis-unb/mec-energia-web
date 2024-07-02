import { Session } from "next-auth";

export type SignInResponsePayload = {
  token: string;

  // Check src/types/next-auth.d.ts
  user: Session["user"];
};

export type SignInRequestPayload = {
  username: string;
  password: string;
};

export type ConfirmResetPasswordPayload = {
  newPassword: string;
  confirmPassword: string;
};

export type ResetPasswordRequestPayload = {
  email: string;
};