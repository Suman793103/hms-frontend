import { AreaChart } from "@mantine/charts";
import React from "react";
import { data } from "../../../Data/DashboardData";

const PatientMatrix = () => {
  const data = [
    {date: "January", patients: 10 },
    {date: "February", patients: 15 },
    {date: "March", patients: 20 },
    {date: "April", patients: 25 },
    {date: "May", patients: 10 },
    {date: "June", patients: 30 },
    {date: "July", patients: 20 },
    {date: "August", patients: 15 },
    {date: "September", patients: 25 },
    {date: "October", patients: 30 },
    {date: "November", patients: 20 },
    {date: "December", patients: 15 },
  ];

  const getSum = (data: any[], key: string) => {
    return data.reduce((sum: number, item: any) => sum + item[key], 0);
  };

  return (
    <div className="bg-violet-50 rounded-xl border shadow-lg ">
      <div className="flex justify-between items-center p-5">
        <div>
          <div className="font-semibold">Patients</div>
          <div className="text-xs text-gray-500">{new Date().getFullYear()}</div>
        </div>
        <div className="text-3xl font-bold text-orange-500">
          {getSum(data, "patients")}
        </div>
      </div>
      <AreaChart
        h={280}
        data={data}
        dataKey="date"
        series={[{ name: "patients", color: "orange" }]}
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

export default PatientMatrix;
