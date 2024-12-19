import React, { useEffect, useState } from "react";
import withAdminAuth from "@/utils/withAdminAuth";
import { Sidebar } from "@/components/admin-page/Sidebar";
import LoadingPage from "@/components/Loading";
import { ChevronDown } from "lucide-react";

interface Report {
  id: string;
  users_full_name: string;
  petsitters_full_name: string;
  issue: string;
  create_at: string;
  status: "New Report" | "Pending" | "Resolved" | "Canceled";
}

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 8;
  const [statusFilter, setStatusFilter] = useState<string>("");

  const fetchData = async (status: string = "") => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/reports?search=${status}`);
      const result = await response.json();
      if (result.data) {
        setData(result.data);
      } else {
        setError("No data available");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    fetchData(status);
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
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 px-10 pt-12">
        {/* Filter and Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-black">Reports</h1>
          <div className="dropdown dropdown-end w-[200px]">
            <div
              tabIndex={0}
              role="button"
              className="w-full bg-white border rounded-lg px-4 py-2.5 flex items-center justify-between text-gray-400 hover:border-gray-400 transition-colors"
            >
              {statusFilter || "All status"}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-white rounded-lg z-[1] w-full mt-1 p-1 shadow-lg border"
            >
              <li>
                <a
                  onClick={() => handleStatusChange("")}
                  className="px-4 py-2 hover:bg-gray-50 rounded-md text-sm"
                >
                  All status
                </a>
              </li>
              <li>
                <a
                  onClick={() => handleStatusChange("New Report")}
                  className="px-4 py-2 hover:bg-gray-50 rounded-md text-sm"
                >
                  New Report
                </a>
              </li>
              <li>
                <a
                  onClick={() => handleStatusChange("Pending")}
                  className="px-4 py-2 hover:bg-gray-50 rounded-md text-sm"
                >
                  Pending
                </a>
              </li>
              <li>
                <a
                  onClick={() => handleStatusChange("Resolved")}
                  className="px-4 py-2 hover:bg-gray-50 rounded-md text-sm"
                >
                  Resolved
                </a>
              </li>
              <li>
                <a
                  onClick={() => handleStatusChange("Canceled")}
                  className="px-4 py-2 hover:bg-gray-50 rounded-md text-sm"
                >
                  Canceled
                </a>
              </li>
            </ul>
          </div>
        </div>

        {loading ? (
          <div className="pt-40">
            <LoadingPage />
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl">
            <table className="w-full">
              <thead>
                <tr className="bg-black text-white h-12">
                  <th className="text-left pl-4 w-[200px] max-w-[200px]">
                    User
                  </th>
                  <th className="text-left w-[200px] max-w-[200px]">
                    Reported Person
                  </th>
                  <th className="text-left w-[240px] max-w-[240px]">Issue</th>
                  <th className="text-left w-[310px] max-w-[310px]">
                    Date Submitted
                  </th>
                  <th className="text-left w-[170px] max-w-[170px]">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((report) => (
                  <tr
                    key={report.id}
                    className="border-y border-y-gray-200 h-[92px]"
                  >
                    <td className="pl-4 w-[200px] max-w-[200px] truncate text-black">
                      {report.users_full_name}
                    </td>
                    <td className="w-[200px] max-w-[200px] truncate text-black">
                      {report.petsitters_full_name}
                    </td>
                    <td className="w-[240px] max-w-[240px] truncate text-black">
                      <div className="truncate w-[150px] max-w-[150px]">
                        {report.issue}
                      </div>
                    </td>
                    <td className="w-[310px] max-w-[310px] truncate text-black">
                      {new Date(report.create_at).toLocaleDateString()}
                    </td>
                    <td className="w-[170px] max-w-[170px]">
                      <div
                        className={`flex items-center gap-2 ${
                          report.status === "New Report"
                            ? "text-pink-500"
                            : report.status === "Pending"
                            ? "text-blue-500"
                            : report.status === "Resolved"
                            ? "text-green-500"
                            : "text-red-600"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            report.status === "New Report"
                              ? "bg-pink-500"
                              : report.status === "Pending"
                              ? "bg-blue-500"
                              : report.status === "Resolved"
                              ? "bg-green-500"
                              : "bg-red-600"
                          }`}
                        ></div>
                        <span className="font-medium">{report.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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
