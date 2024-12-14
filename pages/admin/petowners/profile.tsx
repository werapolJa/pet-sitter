"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import withAdminAuth from "@/utils/withAdminAuth";
import { Sidebar } from "@/components/admin-page/Sidebar";

const AdminPetownerProfile = () => {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/*Sidebar*/}
      <Sidebar />

      <h1 className="pl-10 pt-[56px] text-2xl font-bold">{uid}</h1>
    </div>
  );
};

export default withAdminAuth(AdminPetownerProfile);
