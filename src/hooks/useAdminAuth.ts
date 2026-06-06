/**
 * useAdminAuth hook - Ensures user is authenticated
 */

import { useEffect } from "react";

export function useAdminAuth() {
  useEffect(() => {
    async function verifySession() {
      try {
        const res = await fetch("/api/admin/check-auth");
        
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
