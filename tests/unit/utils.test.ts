import { describe, it, expect } from "vitest";
import { escapeHtml } from "@/lib/sanitize";
import { hashPassword, verifyPassword } from "@/lib/auth";

describe("sanitize", () => {
  it("escapes HTML special characters", () => {
    expect(escapeHtml("<script>alert('xss')</script>")).toBe(
      "&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;"
    );
    expect(escapeHtml('test"value"')).toBe("test&quot;value&quot;");
    expect(escapeHtml("a&b")).toBe("a&amp;b");
  });

  it("handles empty strings", () => {
    expect(escapeHtml("")).toBe("");
  });

  it("handles safe strings", () => {
    expect(escapeHtml("Hello World")).toBe("Hello World");
  });
});

describe("auth", () => {
  it("hashes passwords consistently", async () => {
    const hash1 = await hashPassword("test123");
    const hash2 = await hashPassword("test123");
    expect(hash1).toBe(hash2);
  });

  it("verifies correct passwords", async () => {
    const hash = await hashPassword("mypassword");
    const valid = await verifyPassword("mypassword", hash);
    expect(valid).toBe(true);
  });

  it("rejects incorrect passwords", async () => {
    const hash = await hashPassword("correct");
    const valid = await verifyPassword("wrong", hash);
    expect(valid).toBe(false);
  });
});
