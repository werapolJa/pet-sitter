import React, { useEffect, useState } from "react";
import withAdminAuth from "@/utils/withAdminAuth";
import { Sidebar } from "@/components/admin-page/Sidebar";
import Image from "next/image"; // Import Image component from Next.js
import imagebgicon from "@/public/assets/imagebg-default-icon.svg";

const AdminDashboard = () => {
  // State to store data from the API
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1); // Track the current page
  const [rowsPerPage, setRowsPerPage] = useState<number>(8); // Limit to 8 rows per page

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/admin/petowner"); // Assuming your API endpoint is `/api/getPetOwners`
        const result = await response.json();
        if (result.data) {
          setData(result.data);
        } else {
          setError("No data available");
        }
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate the data to display based on the current page and rows per page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = data.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(data.length / rowsPerPage); // Total number of pages

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Search and Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Pet Owner</h1>
          <label className="input input-bordered flex items-center h-12 w-60 gap-2 max-w-[240px] focus-within:outline-none">
            <input
              type="text"
              className="grow border-none focus:outline-none text-gray-400"
              placeholder="Search..."
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-6 w-6 opacity-70 text-gray-400"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="bg-black text-white h-12">
                <th className="text-left pl-4 w-[240px] max-w-[240px]">
                  Pet Owner
                </th>
                <th className="text-left w-[207px] max-w-[207px]">Phone</th>
                <th className="text-left w-[324px] max-w-[324px]">Email</th>
                <th className="text-left w-[224px] max-w-[224px]">Pet(s)</th>
                <th className="text-left w-[120px] max-w-[120px]">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((user, index) => (
                <tr
                  key={index}
                  className="border-y border-y-gray-200 h-[92px] font-medium text-base leading-7"
                >
                  <td className="pl-4 w-[240px] max-w-[240px]">
                    <div className="flex items-center gap-2 h-full">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.full_name}
                          className="w-11 h-11 rounded-full"
                          width={10}
                          height={10}
                        />
                      ) : (
                        <Image
                          src={imagebgicon}
                          alt="Default profile"
                          className="w-11 h-11 rounded-full"
                          width={10}
                          height={10}
                        />
                      )}
                      {/*long text is truncated with an ellipsis (...)*/}
                      <span className="truncate">{user.full_name}</span>{" "}
                    </div>
                  </td>
                  <td className="w-[207px] max-w-[207px] truncate">
                    {user.phone}
                  </td>
                  <td className="w-[324px] max-w-[324px] truncate">
                    {user.email}
                  </td>
                  <td className="w-[224px] max-w-[224px] truncate">
                    {user.Pet}
                  </td>
                  <td className="w-[120px] max-w-[120px]">
                    {user.Status === "Banned" ? (
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
          {/* Previous Button */}
          <button
            className="btn btn-sm btn-outline"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`btn btn-sm btn-outline ${
                currentPage === index + 1 ? "bg-gray-300" : ""
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          {/* Next Button */}
          <button
            className="btn btn-sm btn-outline"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default withAdminAuth(AdminDashboard);
