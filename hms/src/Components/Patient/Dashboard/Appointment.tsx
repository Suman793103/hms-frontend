import React, { useEffect, useState } from "react";
import { AreaChart } from "@mantine/charts";
import { ScrollArea, ThemeIcon } from "@mantine/core";
import { useSelector } from "react-redux";
import { getAppointment, getAppointmentsByPatient } from "../../../Service/AppointmentService";
import { extractTimeIn12HourFormat, formateDate } from "../../../Utility/DateUtility";

const Appointment = () => {

  const [appointments, setAppointments] = useState<any[]>([]);
  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    getAppointmentsByPatient(user.profileId).then((res) => {
        setAppointments(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const card = (app: any) => {
    return (
      <div
        className="p-3 mb-3 border rounded-xl justify-between border-l-4 border-blue-500 flex shadow-md bg-blue-100 items-center"
        key={app.id}
      >
        <div>
          <div className="font-medium">{app.doctorName}</div>
          <div className="text-sm text-blue-500">{app.reason}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-blue-500">{formateDate(app.appointmentTime)}</div>
          <div className="text-sm text-blue-500">{extractTimeIn12HourFormat(app.appointmentTime)}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 border rounded-xl bg-blue-50 shadow-xl flex flex-col gap-3">
      <div className="text-xl font-semibold text-blue-600">Appointments</div>
      <div>
        <ScrollArea.Autosize mah={300} mx="auto">
          {appointments.map((app) => card(app))}
        </ScrollArea.Autosize>
      </div>
    </div>
  );
};

export default Appointment;
