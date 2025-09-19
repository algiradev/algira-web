import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp: number;
  iat: number;
};

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) return true;

    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch {
    return true;
  }
}
