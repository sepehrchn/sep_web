import { describe, it, expect } from "vitest";
import { checkRequestSize, checkOrigin } from "@/lib/request-validation";

describe("request validation", () => {
  it("blocks oversized requests", () => {
    const request = new Request("http://localhost/api/test", {
      method: "POST",
      headers: { "content-length": "200000" },
    });
    const result = checkRequestSize(request);
    expect(result).not.toBeNull();
    expect(result?.status).toBe(413);
  });

  it("allows normal sized requests", () => {
    const request = new Request("http://localhost/api/test", {
      method: "POST",
      headers: { "content-length": "1000" },
    });
    const result = checkRequestSize(request);
    expect(result).toBeNull();
  });

  it("allows same-origin requests", () => {
    const request = new Request("http://localhost/api/test", {
      method: "POST",
      headers: {
        origin: "http://localhost",
        host: "localhost",
      },
    });
    const result = checkOrigin(request);
    expect(result).toBeNull();
  });

  it("blocks cross-origin requests", () => {
    const request = new Request("http://localhost/api/test", {
      method: "POST",
      headers: {
        origin: "http://evil.com",
        host: "localhost",
      },
    });
    const result = checkOrigin(request);
    expect(result).not.toBeNull();
    expect(result?.status).toBe(403);
  });
});
