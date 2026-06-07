import { createFileRoute } from "@tanstack/react-router";
import { adminFetch } from "@/lib/adminFetch";
import { useState, useEffect } from "react";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { CustomCursor } from "@/components/site/CustomCursor";

export const Route = createFileRoute("/admin/chat-logs")({
  component: AdminChatLogs,
});

function AdminChatLogs() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuthAndFetch() {
      try {
        const authRes = await adminFetch("/api/admin/check-auth");
        if (authRes.status === 401) {
          window.location.href = "/admin/login";
          return;
        }

        if (!authRes.ok) {
          setError("Authentication check failed.");
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Network error when checking auth:", err);
        setError("Unable to reach the server. Ensure the backend is deployed.");
        setLoading(false);
        return;
      }

      try {
        const res = await adminFetch("/api/admin/conversations");
        if (res.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          console.error("Server error fetching conversations:", res.status, txt);
          setError("Failed to fetch conversations from server.");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setSessions(data.sessions || []);
      } catch (err) {
        console.error("Failed to load conversations:", err);
        setError("Unable to reach the server.");
      } finally {
        setLoading(false);
      }
    }

    checkAuthAndFetch();
  }, []);

  if (loading) {
    return (
      <>
        <ScrollProgress />
        <CustomCursor />
        <div className="flex min-h-screen items-center justify-center bg-bg">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
            <p className="text-text-secondary">Loading chat logs...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <ScrollProgress />
        <CustomCursor />
        <div className="flex min-h-screen items-center justify-center bg-bg p-4">
          <div className="text-center">
            <p className="text-red-400">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 rounded-md border border-[var(--border)] bg-bg-card px-4 py-2 text-sm">
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      <div className="min-h-screen bg-bg p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold">Chat Logs</h1>
              <p className="mt-1 text-sm text-text-secondary">Recent chat sessions and messages</p>
            </div>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-bg-card">
            <div className="border-b border-[var(--border)] p-4">
              <h2 className="text-xl font-semibold">Sessions</h2>
              <p className="text-sm text-text-secondary">{sessions.length} session{sessions.length !== 1 && 's'}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-[var(--border)] bg-bg text-left text-sm">
                  <tr>
                    <th className="p-3 font-medium">Session ID</th>
                    <th className="p-3 font-medium">Messages</th>
                    <th className="p-3 font-medium">Last Activity</th>
                    <th className="p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-text-secondary">No chat sessions found</td>
                    </tr>
                  ) : (
                    sessions.map((s: any) => (
                      <>
                        <tr key={s.session_id} className="border-b border-[var(--border)] transition-colors hover:bg-bg/50">
                          <td className="p-3 font-mono text-sm">{s.session_id}</td>
                          <td className="p-3 text-sm">{(s.messages || []).length} message{(s.messages || []).length !== 1 && 's'}</td>
                          <td className="p-3 text-sm">{new Date((s.last_at || 0) * 1).toLocaleString()}</td>
                          <td className="p-3 text-sm">
                            <button onClick={() => setExpanded(expanded === s.session_id ? null : s.session_id)} className="text-sm text-accent hover:underline">
                              {expanded === s.session_id ? 'Hide' : 'View'}
                            </button>
                          </td>
                        </tr>
                        {expanded === s.session_id && (
                          <tr className="border-b border-[var(--border)] bg-bg/30">
                            <td colSpan={4} className="p-4">
                              <div className="space-y-3 text-sm">
                                {(s.messages || []).map((m: any) => (
                                  <div key={m.id} className="rounded border border-[var(--border)] bg-bg p-3">
                                    <div className="text-xs text-text-secondary">{m.role} • {new Date((m.created_at || 0)).toLocaleString()}</div>
                                    <div className="mt-1 whitespace-pre-wrap">{m.content}</div>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
