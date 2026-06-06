import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";

// Layout route for /admin/* - authentication verification is done in API endpoints
// All admin APIs return 401 if not authenticated, causing the page to redirect
export const Route = createFileRoute("/admin")({
  component: () => <Outlet />,
});
