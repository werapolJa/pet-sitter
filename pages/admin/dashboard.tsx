import React from "react";
import withAdminAuth from "@/utils/withAdminAuth";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col">
        <div className="p-6 text-2xl font-bold flex items-center gap-2">
          <span className="text-orange-500">Sitter</span>
          <span className="text-green-500">*</span>
        </div>
        <nav className="flex flex-col gap-2 text-sm font-medium mt-6 px-4">
          <a
            href="#"
            className="py-2 px-4 hover:bg-gray-800 rounded-lg flex items-center"
          >
            Pet Owner
          </a>
          <a
            href="#"
            className="py-2 px-4 hover:bg-gray-800 rounded-lg flex items-center"
          >
            Pet Sitter
          </a>
          <a
            href="#"
            className="py-2 px-4 hover:bg-gray-800 rounded-lg flex items-center"
          >
            Report
          </a>
        </nav>
        <div className="mt-auto px-4 pb-6">
          <button className="w-full bg-gray-800 text-white py-2 rounded-lg">
            Log Out
          </button>
        </div>
      </aside>

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
