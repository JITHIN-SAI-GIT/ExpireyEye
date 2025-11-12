// This component receives the 'items' array as a prop from MainContent.js
import { useEffect } from "react";

export default function UrgentItemsTable({ items }) {
  function formatDate(dateString) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  function getExpiryColor(expiryDate) {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now; // milliseconds difference
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // convert to days

    if (diffDays < 0) {
      return "text-red-600"; // expired - red
    } else if (diffDays <= 2) {
      return "text-orange-400"; // expires in 2 days - orange
    } else{
      return "text-green-600"; // more than a week left - green
    }
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg mt-6">
      <h3 className="font-bold mb-4 text-white">Urgent Items</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          {/* Table Header */}
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="p-2">Product Name</th>
              <th className="p-2">Category</th>
              <th className="p-2">Expiry Date</th>
              <th className="p-2">Quantity</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {/* First, check if the 'items' array exists and has content */}
            {items && items.length > 0 ? (
              // If it has items, map over them to create a row for each one
              items.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-gray-700 hover:bg-gray-700"
                >
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.category}</td>
                  {/* We apply special styling to the expiry date to make it stand out */}
                  <td
                    className={`p-2 font-semibold ${getExpiryColor(
                      item.expiryDate
                    )}`}
                  >
                    {formatDate(item.expiryDate)}
                  </td>

                  <td className="p-2">{item.quantity}</td>
                </tr>
              ))
            ) : (
              // If the 'items' array is empty, display a helpful message
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No urgent items found. Great job!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
