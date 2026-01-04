import React from "react";

const Table = () => {
  return (
    <div className="p-4 md:p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Users Table</h1>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full min-w-[650px] text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-gray-700 font-medium">Name</th>
              <th className="px-6 py-3 text-gray-700 font-medium">Email</th>
              <th className="px-6 py-3 text-gray-700 font-medium">Status</th>
              <th className="px-6 py-3 text-gray-700 font-medium">Role</th>
              <th className="px-6 py-3 text-gray-700 font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {/* ROW 1 */}
            <tr className="border-b hover:bg-gray-50">
              <td className="px-6 py-4">Lal</td>
              <td className="px-6 py-4">lal@example.com</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg">
                  Active
                </span>
              </td>
              <td className="px-6 py-4">Member</td>
              <td className="px-6 py-4 text-right">
                <button className="text-blue-600 hover:underline mr-3">
                  Edit
                </button>
                <button className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>

            {/* ROW 2 */}
            <tr className="border-b hover:bg-gray-50">
              <td className="px-6 py-4">Sarah</td>
              <td className="px-6 py-4">sarah@example.com</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-lg">
                  Pending
                </span>
              </td>
              <td className="px-6 py-4">Guest</td>
              <td className="px-6 py-4 text-right">
                <button className="text-blue-600 hover:underline mr-3">
                  Edit
                </button>
                <button className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>

            {/* ROW 3 */}
            <tr className="border-b hover:bg-gray-50">
              <td className="px-6 py-4">Michael</td>
              <td className="px-6 py-4">michael@example.com</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg">
                  Inactive
                </span>
              </td>
              <td className="px-6 py-4">Admin</td>
              <td className="px-6 py-4 text-right">
                <button className="text-blue-600 hover:underline mr-3">
                  Edit
                </button>
                <button className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
