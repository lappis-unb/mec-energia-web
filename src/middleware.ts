export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/uc/:id*", "/distribuidoras/:id*"],
};
