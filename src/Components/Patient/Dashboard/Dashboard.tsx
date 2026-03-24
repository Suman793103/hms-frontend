import React from "react";
import Welcome from "./Welcome";
import Visits from "./Visits";
import Appointment from "./Appointment";
import Medications from "./Medications";
import DiseaseChart from "./DiseaseChart";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid lg:grid-cols-2 gap-5">
        <Welcome />
        <Visits />
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <DiseaseChart />
        <Appointment />
        <Medications />
      </div>
    </div>
  );
};

export default Dashboard;
