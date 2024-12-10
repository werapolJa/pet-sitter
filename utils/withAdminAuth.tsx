import React, { useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

interface SupabaseJwtPayload {
  email: string;
  role: string;
  [key: string]: any;
}

function withAdminAuth<P extends { children?: ReactNode }>(
  WrappedComponent: React.ComponentType<P>
) {
  return function ProtectedRoute(props: P) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        router.push("/admin/login");
        return;
      }

      try {
        const userData = jwtDecode<SupabaseJwtPayload>(token);
        if (userData.role !== "admin") {
          router.push("/admin/login");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        router.push("/admin/login");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
}

export default withAdminAuth;
