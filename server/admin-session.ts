import { SignJWT, jwtVerify } from "jose";
import { ENV } from "./_core/env";

export type AdminSessionClaims = {
  id: number;
  username: string;
  role: string;
};

const ADMIN_SESSION_AUDIENCE = "royal-horology-admin";
const ADMIN_SESSION_LIFETIME = "24h";

function getSecretKey(secret = ENV.cookieSecret) {
  if (!secret) throw new Error("Administrator session signing secret is unavailable");
  return new TextEncoder().encode(secret);
}

/** Creates a signed, time-limited administrator session token for the HTTP-only cookie. */
export async function issueAdminSessionToken(
  session: AdminSessionClaims,
  secret = ENV.cookieSecret
): Promise<string> {
  return new SignJWT({ username: session.username, role: session.role })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(String(session.id))
    .setAudience(ADMIN_SESSION_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(ADMIN_SESSION_LIFETIME)
    .sign(getSecretKey(secret));
}

/** Returns trusted administrator claims only when a token is correctly signed and unexpired. */
export async function verifyAdminSessionToken(
  token: string | null | undefined,
  secret = ENV.cookieSecret
): Promise<AdminSessionClaims | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey(secret), {
      algorithms: ["HS256"],
      audience: ADMIN_SESSION_AUDIENCE,
    });
    const id = Number(payload.sub);
    const username = payload.username;
    const role = payload.role;

    if (!Number.isSafeInteger(id) || id <= 0 || typeof username !== "string" || !username || typeof role !== "string" || !role) {
      return null;
    }

    return { id, username, role };
  } catch {
    return null;
  }
}
