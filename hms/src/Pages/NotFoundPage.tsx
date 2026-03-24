import { Button } from "@mantine/core";
import React from "react";
import { useNavigate } from "react-router";

const NotFound = () => {

    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 max-w-md w-full p-8 rounded-lg shadow-lg text-center">
        {/* SVG icon for visual illustration */}
        <svg
          className="mx-auto mb-4 w-20 h-20 text-yellow-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M7.938 2.016a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233C-.292 14.011.257 15 1.146 15h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
          <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0m0-6.005a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
        </svg>
        <h1 className="text-6xl font-extrabold text-gray-800 dark:text-gray-100">
          404
        </h1>
        <p className="mt-2 text-xl text-gray-600 dark:text-gray-400 mb-6">
          Sorry, the page was not found.
        </p>
        <Button
          onClick={() => navigate(-1)}
          className="inline-block px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md shadow-md transition-colors"
        >
          Go to Homepage
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
