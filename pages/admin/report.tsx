import React from "react";
import withAdminAuth from "@/utils/withAdminAuth";
import { Sidebar } from "@/components/admin-page/Sidebar";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Search and Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Report</h1>
          <input
            type="text"
            placeholder="Search..."
            className="input input-bordered w-64"
          />
        </div>
      </div>
    </div>
  );
};

export default withAdminAuth(AdminDashboard);
