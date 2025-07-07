import { JwtPayload as DefaultJwtPayload } from "jwt-decode";

export interface JwtPayload extends DefaultJwtPayload {
  id: string;
  name: string;
  role: "ADMIN" | "USER";
}
