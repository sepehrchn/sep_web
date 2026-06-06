/**
 * useAdminAuth hook - Ensures user is authenticated
 */

import { useEffect } from "react";
import { adminFetch } from "@/lib/adminFetch";

export function useAdminAuth() {
  useEffect(() => {
    async function verifySession() {
      try {
        const res = await adminFetch("/api/admin/check-auth");
        
        if (!res.ok) {
          window.location.href = "/admin/login";
        }
      } catch (error) {
        window.location.href = "/admin/login";
      }
    }

    verifySession();
  }, []);
}
