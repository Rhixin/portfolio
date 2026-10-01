import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getAdminCookieName,
  getAdminSessionSecret,
  verifyAdminPassword,
  verifyAdminSessionCookie,
} from "./adminAuth";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getAdminCookieName", () => {
  it("returns a stable cookie name", () => {
    expect(getAdminCookieName()).toBe("admin_session");
  });
});

describe("verifyAdminPassword", () => {
  it("returns true for the correct password", () => {
    vi.stubEnv("ADMIN_PASSWORD", "secret123");
    expect(verifyAdminPassword("secret123")).toBe(true);
  });

  it("returns false for the wrong password", () => {
    vi.stubEnv("ADMIN_PASSWORD", "secret123");
    expect(verifyAdminPassword("wrong")).toBe(false);
  });

  it("returns false when ADMIN_PASSWORD is not set", () => {
    vi.stubEnv("ADMIN_PASSWORD", "");
    expect(verifyAdminPassword("anything")).toBe(false);
  });
});

describe("verifyAdminSessionCookie", () => {
  it("returns true when the cookie matches the secret", () => {
    vi.stubEnv("ADMIN_SESSION_SECRET", "topsecret");
    expect(verifyAdminSessionCookie("topsecret")).toBe(true);
  });

  it("returns false when the cookie is missing", () => {
    vi.stubEnv("ADMIN_SESSION_SECRET", "topsecret");
    expect(verifyAdminSessionCookie(undefined)).toBe(false);
  });

  it("returns false when the cookie doesn't match", () => {
    vi.stubEnv("ADMIN_SESSION_SECRET", "topsecret");
    expect(verifyAdminSessionCookie("wrong")).toBe(false);
  });
});

describe("getAdminSessionSecret", () => {
  it("returns the configured secret", () => {
    vi.stubEnv("ADMIN_SESSION_SECRET", "topsecret");
    expect(getAdminSessionSecret()).toBe("topsecret");
  });

  it("throws when the secret is not set", () => {
    vi.stubEnv("ADMIN_SESSION_SECRET", "");
    expect(() => getAdminSessionSecret()).toThrow();
  });
});
