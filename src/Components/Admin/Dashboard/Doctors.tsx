import React, { useEffect, useState } from "react";
import { AreaChart } from "@mantine/charts";
import {
  appointments,
  data,
  doctorData,
  doctors,
  patientData,
} from "../../../Data/DashboardData";
import { ScrollArea, ThemeIcon } from "@mantine/core";
import { getAllDoctors } from "../../../Service/DoctorProfileService";

const Doctors = () => {

  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    getAllDoctors().then((res) => {
      setDoctors(res);
    }).catch((err) => {
      console.log("Error fetching doctors", err);
    });
  }, []);

  const card = (app: any) => {
    return (
      <div
        className="p-3 mb-3 border rounded-xl justify-between border-l-4 border-red-500 flex shadow-md bg-red-100"
        key={app.id}
      >
        <div>
          <div className="font-medium text-sm">{app.name}</div>
          <div className="text-xs text-gray-500">{app.department}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">{app.address}</div>
          <div className="text-xs text-gray-500">{app.email}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 border rounded-xl bg-red-50 shadow-xl flex flex-col gap-3">
      <div className="text-xl font-semibold">Doctors</div>
      <div>
        <ScrollArea.Autosize mah={300} mx="auto">
          {doctors.map((app) => card(app))}
        </ScrollArea.Autosize>
      </div>
    </div>
  );
};

export default Doctors;
