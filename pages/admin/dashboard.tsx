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
          <h1 className="text-2xl font-semibold">Pet Owner</h1>
          <input
            type="text"
            placeholder="Search..."
            className="input input-bordered w-64"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="table w-full">
            {/* Table Head */}
            <thead>
              <tr className="bg-black text-white">
                <th>Pet Owner</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Pet(s)</th>
                <th>Status</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {[...Array(8)].map((_, index) => (
                <tr key={index}>
                  <td className="flex items-center gap-2">
                    <img
                      src="https://via.placeholder.com/40"
                      alt="Owner"
                      className="w-10 h-10 rounded-full"
                    />
                    John Wick
                  </td>
                  <td>099 996 6734</td>
                  <td>johnwicklovedogs@dogorg.com</td>
                  <td>2</td>
                  <td>
                    {index === 3 ? (
                      <span className="text-red-500 font-medium">Banned</span>
                    ) : (
                      <span className="text-green-500 font-medium">Normal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-6 gap-2">
          <button className="btn btn-sm btn-outline">1</button>
          <button className="btn btn-sm btn-outline">2</button>
          <span className="text-gray-500">...</span>
          <button className="btn btn-sm btn-outline">44</button>
          <button className="btn btn-sm btn-outline">45</button>
        </div>
      </div>
    </div>
  );
};

export default withAdminAuth(AdminDashboard);
