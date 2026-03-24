import React, { use, useEffect, useState } from "react";
import { AreaChart } from "@mantine/charts";
import {
  appointments,
  data,
  doctorData,
  patientData,
} from "../../../Data/DashboardData";
import { ScrollArea, ThemeIcon } from "@mantine/core";
import {
  IconClipboard,
  IconFileReport,
  IconPhoto,
  IconStethoscope,
  IconUser,
} from "@tabler/icons-react";
import { get } from "http";
import { getTodaysAppointments } from "../../../Service/AppointmentService";
import { extractTimeIn12HourFormat } from "../../../Utility/DateUtility";

const Appointment = () => {
  const [tdAppointment, setTdAppointment] = useState<any[]>(appointments);

  useEffect(() => {
    getTodaysAppointments().then((res) => {
      setTdAppointment(res);
    }).catch((err) => {
      console.log(err);
    });
  }, []);
  const card = (app: any) => {
    return (
      <div
        className="p-3 mb-3 border rounded-xl justify-between border-l-4 border-violet-500 flex shadow-md bg-violet-100"
        key={app.id}
      >
        <div>
          <div className="font-medium text-sm">{app.patientName}</div>
          <div className="text-xs text-gray-500">Dr. {app.doctorName}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">{app.reason}</div>
          <div className="text-xs text-gray-500">{extractTimeIn12HourFormat(app.appointmentTime)}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 border rounded-xl bg-violet-50 shadow-xl flex flex-col gap-3">
      <div className="text-xl font-semibold">Todays Appointments</div>
      <div>
        <ScrollArea.Autosize mah={300} mx="auto">
          {tdAppointment.map((app) => card(app))}
        </ScrollArea.Autosize>
      </div>
    </div>
  );
};

export default Appointment;
