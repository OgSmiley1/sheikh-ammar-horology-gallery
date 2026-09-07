import { describe, expect, it } from "vitest";
import { issueAdminSessionToken, verifyAdminSessionToken } from "../admin-session";

const testSecret = "unit-test-admin-session-secret-with-sufficient-length";

describe("administrator session tokens", () => {
  it("accepts a server-issued token with intact claims", async () => {
    const token = await issueAdminSessionToken(
      { id: 7, username: "MOATH", role: "admin" },
      testSecret
    );

    await expect(verifyAdminSessionToken(token, testSecret)).resolves.toEqual({
      id: 7,
      username: "MOATH",
      role: "admin",
    });
  });

  it("rejects a legacy JSON cookie and a malformed token instead of trusting cookie presence", async () => {
    await expect(
      verifyAdminSessionToken(JSON.stringify({ id: 7, username: "MOATH" }), testSecret)
    ).resolves.toBeNull();
    await expect(verifyAdminSessionToken("forged.admin.cookie", testSecret)).resolves.toBeNull();
  });

  it("rejects a correctly signed token when it is verified with a different secret", async () => {
    const token = await issueAdminSessionToken(
      { id: 7, username: "MOATH", role: "admin" },
      testSecret
    );

    await expect(verifyAdminSessionToken(token, "different-unit-test-secret")).resolves.toBeNull();
  });
});
