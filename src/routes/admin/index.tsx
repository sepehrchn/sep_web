import { createFileRoute } from "@tanstack/react-router";
import { type Contact } from "@/lib/db/queries";
import { useState, useEffect } from "react";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { CustomCursor } from "@/components/site/CustomCursor";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<Contact["status"] | "all">("all");

  useEffect(() => {
    async function checkAuthAndFetch() {
      // First check if authenticated
      try {
        const authRes = await fetch("/api/admin/check-auth");
        if (authRes.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
      } catch {
        window.location.href = "/admin/login";
        return;
      }

      // If authenticated, fetch contacts
      try {
        const res = await fetch("/api/admin/contacts");
        
        if (res.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        
        if (!res.ok) {
          throw new Error("Failed to fetch contacts");
        }
        
        const data = await res.json();
        setContacts(data.contacts);
      } catch (err) {
        console.error("Failed to load contacts:", err);
        setError("Failed to load contacts. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    }
    
    checkAuthAndFetch();
  }, []);

  const updateStatus = async (id: number, status: Contact["status"]) => {
    const res = await fetch(`/api/admin/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.status === 401) {
      window.location.href = "/admin/login";
      return;
    }

    if (res.ok) {
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const statusColors: Record<Contact["status"], string> = {
    new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    contacted: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    in_progress: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    completed: "bg-green-500/10 text-green-400 border-green-500/20",
    archived: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };

  const filteredContacts = filter === "all" 
    ? contacts 
    : contacts.filter(c => c.status === filter);

  const stats = {
    total: contacts.length,
    new: contacts.filter(c => c.status === "new").length,
    in_progress: contacts.filter(c => c.status === "in_progress").length,
    completed: contacts.filter(c => c.status === "completed").length,
  };

  if (loading) {
    return (
      <>
        <ScrollProgress />
        <CustomCursor />
        <div className="flex min-h-screen items-center justify-center bg-bg">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
            <p className="text-text-secondary">Loading dashboard...</p>
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
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-md border border-[var(--border)] bg-bg-card px-4 py-2 text-sm transition-colors hover:border-[var(--border-hover)]"
            >
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
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-text-secondary">Manage contact submissions</p>
            </div>
            <button
              onClick={logout}
              className="rounded-md border border-[var(--border)] bg-bg-card px-4 py-2 text-sm transition-colors hover:border-[var(--border-hover)] hover:text-accent"
            >
              Logout
            </button>
          </div>

          {/* Stats */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-[var(--border)] bg-bg-card p-4">
              <div className="text-sm text-text-secondary">Total</div>
              <div className="mt-1 text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
              <div className="text-sm text-blue-400">New</div>
              <div className="mt-1 text-2xl font-bold text-blue-400">{stats.new}</div>
            </div>
            <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
              <div className="text-sm text-purple-400">In Progress</div>
              <div className="mt-1 text-2xl font-bold text-purple-400">{stats.in_progress}</div>
            </div>
            <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
              <div className="text-sm text-green-400">Completed</div>
              <div className="mt-1 text-2xl font-bold text-green-400">{stats.completed}</div>
            </div>
          </div>

          {/* Filter */}
          <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
            {(["all", "new", "contacted", "in_progress", "completed", "archived"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  filter === status
                    ? "bg-accent text-white"
                    : "border border-[var(--border)] text-text-secondary hover:border-[var(--border-hover)]"
                }`}
              >
                {status === "all" ? "All" : status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>

          {/* Contacts Table */}
          <div className="rounded-lg border border-[var(--border)] bg-bg-card">
            <div className="border-b border-[var(--border)] p-4">
              <h2 className="text-xl font-semibold">Contact Submissions</h2>
              <p className="text-sm text-text-secondary">
                {filteredContacts.length} {filter !== "all" && `${filter} `}contact{filteredContacts.length !== 1 && "s"}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-[var(--border)] bg-bg text-left text-sm">
                  <tr>
                    <th className="p-3 font-medium">Name</th>
                    <th className="p-3 font-medium">Email</th>
                    <th className="hidden p-3 font-medium md:table-cell">Company</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="hidden p-3 font-medium sm:table-cell">Date</th>
                    <th className="p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-text-secondary">
                        No contacts found
                      </td>
                    </tr>
                  ) : (
                    filteredContacts.map((contact) => (
                      <>
                        <tr
                          key={contact.id}
                          className="border-b border-[var(--border)] transition-colors hover:bg-bg/50"
                        >
                          <td className="p-3 font-medium">{contact.name}</td>
                          <td className="p-3">
                            <a href={`mailto:${contact.email}`} className="font-mono text-sm text-accent hover:underline">
                              {contact.email}
                            </a>
                          </td>
                          <td className="hidden p-3 text-sm text-text-secondary md:table-cell">
                            {contact.company || "-"}
                          </td>
                          <td className="p-3">
                            <select
                              value={contact.status}
                              onChange={(e) =>
                                updateStatus(
                                  contact.id,
                                  e.target.value as Contact["status"]
                                )
                              }
                              className={`rounded-full border px-3 py-1 text-xs font-medium ${statusColors[contact.status]}`}
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="archived">Archived</option>
                            </select>
                          </td>
                          <td className="hidden p-3 text-sm text-text-secondary sm:table-cell">
                            {new Date(contact.created_at * 1000).toLocaleDateString()}
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => setExpandedId(expandedId === contact.id ? null : contact.id)}
                              className="text-sm text-accent hover:underline"
                            >
                              {expandedId === contact.id ? "Hide" : "Details"}
                            </button>
                          </td>
                        </tr>
                        {expandedId === contact.id && (
                          <tr className="border-b border-[var(--border)] bg-bg/30">
                            <td colSpan={6} className="p-4">
                              <div className="space-y-3 text-sm">
                                <div className="md:hidden">
                                  <span className="font-medium text-text-secondary">Company: </span>
                                  {contact.company || "Not provided"}
                                </div>
                                <div>
                                  <span className="font-medium text-text-secondary">Budget: </span>
                                  {contact.budget?.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase()) || "Not specified"}
                                </div>
                                <div>
                                  <span className="font-medium text-text-secondary">Project Description:</span>
                                  <p className="mt-1 whitespace-pre-wrap rounded border border-[var(--border)] bg-bg p-3">
                                    {contact.project}
                                  </p>
                                </div>
                                <div className="flex gap-4 text-xs text-text-tertiary">
                                  <span>ID: {contact.id}</span>
                                  <span>Created: {new Date(contact.created_at * 1000).toLocaleString()}</span>
                                  <span>Updated: {new Date(contact.updated_at * 1000).toLocaleString()}</span>
                                </div>
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
