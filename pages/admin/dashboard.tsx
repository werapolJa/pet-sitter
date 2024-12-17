import React, { useEffect, useState } from "react";
import Link from "next/link";
import withAdminAuth from "@/utils/withAdminAuth";
import { Sidebar } from "@/components/admin-page/Sidebar";
import Image from "next/image"; // Import Image component from Next.js
import imagebgicon from "@/public/assets/imagebg-default-icon.svg";
import LoadingPage from "@/components/Loading";

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
      const response = await fetch(`/api/admin/petowners?search=${query}`);
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/*Sidebar and Search box*/}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 px-10 pt-12">
        {/* Search and Header */}
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
              width="20"
              height="20"
              viewBox="0 0 20 20"
              className="w-5 h-5 opacity-70 text-gray-400 cursor-pointer"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              onClick={handleSearch}
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16C10.8844 16 12.5949 15.2554 13.8533 14.0443C13.8806 14.0085 13.9106 13.9741 13.9433 13.9413C13.9759 13.9087 14.0103 13.8788 14.046 13.8516C15.2561 12.5934 16 10.8836 16 9C16 5.13401 12.866 2 9 2ZM16.0328 14.6166C17.2639 13.0771 18 11.1245 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18C11.1255 18 13.0789 17.2632 14.6188 16.031L18.2933 19.7055C18.6838 20.0961 19.317 20.0961 19.7075 19.7055C20.098 19.315 20.098 18.6819 19.7075 18.2913L16.0328 14.6166Z"
                fill="#AEB1C3"
              />
            </svg>
          </div>
        </div>

        {/*Table*/}
        {loading ? (
          <div className="pt-40">
            <LoadingPage />
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl">
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
                    className="border-y border-y-gray-200 h-[92px]"
                  >
                    <td className="pl-4 w-[240px] max-w-[240px]">
                      <Link
                        href={{
                          pathname: "/admin/petowners/profile",
                          query: { uid: `${user.uid}` },
                        }}
                        className="flex items-center gap-2 h-full cursor-pointer"
                      >
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
                      </Link>
                    </td>
                    <td className="w-[207px] max-w-[207px] truncate">
                      {user.phone}
                    </td>
                    <td className="w-[324px] max-w-[324px] truncate">
                      {user.email}
                    </td>
                    <td className="w-[224px] max-w-[224px] truncate">
                      {user.pet}
                    </td>
                    <td className="w-[120px] max-w-[120px]">
                      {user.status === "Banned" ? (
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                          <span className="text-red-500 font-medium">
                            Banned
                          </span>
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
        )}

        {/*Pagination*/}
        <div className="flex justify-center items-center mt-6 pb-2">
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
