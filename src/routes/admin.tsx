import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { checkAuth } from "@/lib/check-auth";

// Layout route for /admin/* (except /admin/login)
// Any route under admin/ directory inherits this beforeLoad check
export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    // Skip auth check for login page
    if (location.pathname === "/admin/login") {
      return;
    }
    
    const { isAuthenticated } = await checkAuth();
    
    if (!isAuthenticated) {
      throw redirect({
        to: "/admin/login",
        search: { redirect: location.pathname },
      });
    }
  },
  component: () => <Outlet />,
});
