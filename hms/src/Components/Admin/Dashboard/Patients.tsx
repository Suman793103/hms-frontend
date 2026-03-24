import React, { useEffect, useState } from "react";
import { AreaChart } from "@mantine/charts";
import {
  appointments,
  data,
  doctorData,
  patientData,
  patients,
} from "../../../Data/DashboardData";
import { ScrollArea, ThemeIcon } from "@mantine/core";
import {
  IconClipboard,
  IconFileReport,
  IconPhoto,
  IconStethoscope,
  IconUser,
} from "@tabler/icons-react";
import { getAllPatients } from "../../../Service/PatientProfileService";
import { bloodGroupsMap } from "../../../Data/DropdownData";

const Patients = () => {

  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    getAllPatients().then((res) => {
      setPatients(res);
    }).catch((err) => {
      console.log("Error fetching patients", err);
    });
  }, []);

  const card = (app: any) => {
    return (
      <div
        className="p-3 mb-3 border rounded-xl justify-between border-l-4 border-teal-500 flex shadow-md bg-teal-100"
        key={app.id}
      >
        <div>
          <div className="font-medium text-sm">{app.name}</div>
          <div className="text-xs text-gray-500">{app.email}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">{app.address}</div>
          <div className="text-xs text-gray-500">Blood Group: {bloodGroupsMap[app.bloodGroup]}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 border rounded-xl bg-teal-50 shadow-xl flex flex-col gap-3">
      <div className="text-xl font-semibold">Patients</div>
      <div>
        <ScrollArea.Autosize mah={300} mx="auto">
          {patients.map((app) => card(app))}
        </ScrollArea.Autosize>
      </div>
    </div>
  );
};

export default Patients;
