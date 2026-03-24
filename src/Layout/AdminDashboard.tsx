import React from "react";
import Sidebar from "../Components/Admin/Sidebar/Sidebar";
import Header from "../Components/Header/Header";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";

const AdminDashboard = () => {
  const matches = useMediaQuery("(max-width: 768px)");
  return (
    <div className="flex">
      {!matches && <Sidebar />}
      <div className="w-full flex flex-col overflow-hidden">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
