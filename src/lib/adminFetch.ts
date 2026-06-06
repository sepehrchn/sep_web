export async function adminFetch(input: RequestInfo, init: RequestInit = {}) {
  // Read per-tab token from sessionStorage (cleared when tab is closed)
  let tabToken: string | null = null;
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      tabToken = sessionStorage.getItem("admin_tab");
    }
  } catch (_) {
    tabToken = null;
  }

  const headers = new Headers(init.headers || {});
  if (tabToken) headers.set("X-Admin-Tab", tabToken);

  return fetch(input, { ...init, headers });
}

export default adminFetch;
