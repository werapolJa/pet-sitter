import React, { useEffect, useState } from "react";
import withAdminAuth from "@/utils/withAdminAuth";
import { Sidebar } from "@/components/admin-page/Sidebar";
import Image from "next/image"; // Import Image component from Next.js
import imagebgicon from "@/public/assets/imagebg-default-icon.svg";

const AdminDashboard = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(8);
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query state

  // Fetch data based on the search query
  const fetchData = async (query: string = "") => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/petowner?search=${query}`);
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

  useEffect(() => {
    fetchData(); // Initial fetch without a search query
  }, []);

  const handleSearch = () => {
    fetchData(searchQuery); // Trigger fetch when the search button is clicked
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = data.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(data.length / rowsPerPage);

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
      {/*Sidebar and Search box*/}
      <Sidebar />
      <div className="flex-1 px-10 pt-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Pet Owner</h1>
          <div className="input input-bordered flex items-center h-12 w-60 gap-2 max-w-[240px] focus-within:outline-none">
            <input
              type="text"
              className="grow border-none focus:outline-none text-gray-400"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="2.25 1 10 10" // Adjusted viewBox to match path size
              fill="currentColor"
              className="w-5 h-5 opacity-70 text-gray-400 cursor-pointer"
              onClick={handleSearch}
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/*Table*/}
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
                <tr key={index} className="border-y border-y-gray-200 h-[92px]">
                  <td className="pl-4 w-[240px] max-w-[240px]">
                    <div className="flex items-center gap-2 h-full">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.full_name}
                          className="w-10 h-10 rounded-full"
                          width={40}
                          height={40}
                        />
                      ) : (
                        <Image
                          src={imagebgicon}
                          alt="Default profile"
                          className="w-10 h-10 rounded-full"
                          width={40}
                          height={40}
                        />
                      )}
                      <span className="truncate">{user.full_name}</span>
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
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        <span className="text-red-500 font-medium">Banned</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        <span className="text-green-500 font-medium">
                          Normal
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/*Pagination*/}
        <div className="flex justify-center items-center mt-6">
          <nav className="flex items-center gap-3 px-2 py-1 rounded-lg">
            <button
              className="p-2 hover:bg-white rounded-md transition-colors"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-300"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              if (
                pageNumber <= 2 ||
                pageNumber === currentPage ||
                pageNumber >= totalPages - 1
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-10 h-10 rounded-full text-base font-bold transition-colors ${
                      currentPage === pageNumber
                        ? "bg-orange-100 text-orange-500"
                        : "text-gray-300 hover:bg-white bg-white"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              }
              if (pageNumber === 3 || pageNumber === totalPages - 2) {
                return (
                  <span key={pageNumber} className="text-gray-300 font-bold">
                    ...
                  </span>
                );
              }
              return null;
            })}
            <button
              className="p-2 hover:bg-white rounded-md transition-colors"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-300"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default withAdminAuth(AdminDashboard);
