import { AreaChart } from "@mantine/charts";
import { count } from "console";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { countAllAppointments, countAppointmentsByPatient } from "../../../Service/AppointmentService";
import { addZeroMonths } from "../../../Utility/OtherUtility";

const Visits = () => {
  const [appointments, setAppointments] = React.useState<any[]>([]);
  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    countAppointmentsByPatient(user.profileId).then((res) => {
        setAppointments(addZeroMonths(res, "month", "count"));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getSum = (data: any[], key: string) => {
    return data.reduce((sum: number, item: any) => sum + item[key], 0);
  };

  return (
    <div className="bg-violet-50 rounded-xl border shadow-lg ">
      <div className="flex justify-between items-center p-5">
        <div>
          <div className="font-semibold">Visits</div>
          <div className="text-xs text-gray-500">
            {new Date().getFullYear()}
          </div>
        </div>
        <div className="text-3xl font-bold text-violet-500">
          {getSum(appointments, "count")}
        </div>
      </div>
      <AreaChart
        h={150}
        data={appointments}
        dataKey="month"
        series={[{ name: "count", color: "violet" }]}
        strokeWidth={5}
        withGradient
        fillOpacity={0.7}
        curveType="bump"
        tickLine="none"
        gridAxis="none"
        withXAxis={false}
        withYAxis={false}
        withDots={false}
      />
    </div>
  );
};

export default Visits;
