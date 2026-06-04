/**
 * Validates request size and origin for API routes.
 */

const MAX_BODY_SIZE = 100 * 1024; // 100KB

export function checkRequestSize(request: Request): Response | null {
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
    return new Response(
      JSON.stringify({ error: "Request too large" }),
      { status: 413, headers: { "Content-Type": "application/json" } }
    );
  }
  return null;
}

export function checkOrigin(request: Request): Response | null {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  
  // Allow same-origin and local dev
  if (!origin || origin.includes(host || "") || origin.includes("localhost") || origin.includes("127.0.0.1")) {
    return null;
  }
  
  return new Response(
    JSON.stringify({ error: "Forbidden" }),
    { status: 403, headers: { "Content-Type": "application/json" } }
  );
}
