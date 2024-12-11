import React, { useEffect, ReactNode, useState } from "react";
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
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setIsAuthorized(false);
        router.replace("/admin/login");
        return;
      }

      try {
        const userData = jwtDecode<SupabaseJwtPayload>(token);

        if (userData.role === "admin") {
          setIsAuthorized(true); // Authorized as admin
        } else {
          setIsAuthorized(false);
          router.replace("/admin/login");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsAuthorized(false);
        router.replace("/admin/login");
      }
    }, [router]);

    if (isAuthorized === null) {
      // Show a loading spinner or blank state while checking authorization
      return <div>Loading...</div>;
    }

    if (!isAuthorized) {
      // Prevent rendering while redirecting
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

export default withAdminAuth;
