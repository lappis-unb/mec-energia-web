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

export type ResetPasswordRequestPayload = {
  password: string;
  confirmPassword: string;
};