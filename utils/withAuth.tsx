import React, { useEffect } from "react";
import { useRouter } from "next/router";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const Wrapper: React.FC<P> = (props) => {
    const router = useRouter();

    useEffect(() => {
      const isLoggedIn = localStorage.getItem("token");

      if (!isLoggedIn) {
        router.push("/petowners/login");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
