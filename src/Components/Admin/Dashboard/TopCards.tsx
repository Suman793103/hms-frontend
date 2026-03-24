import React, { use, useEffect, useState } from "react";
import { AreaChart } from "@mantine/charts";
import { data, doctorData, patientData } from "../../../Data/DashboardData";
import { ThemeIcon } from "@mantine/core";
import {
  IconClipboard,
  IconFileReport,
  IconPhoto,
  IconStethoscope,
  IconUser,
} from "@tabler/icons-react";
import { countAllAppointments } from "../../../Service/AppointmentService";
import { addZeroMonths } from "../../../Utility/OtherUtility";
import { get } from "http";
import { getRegistrationCounts } from "../../../Service/UserService";

const TopCards = () => {
  const [apData, setApData] = useState<any[]>(data);
  const [ptData, setPtData] = useState<any[]>(patientData);
  const [drData, setDrData] = useState<any[]>(doctorData);

  useEffect(() => {
    countAllAppointments().then((res) => {
      console.log(addZeroMonths(res, "month", "count"));
      setApData(addZeroMonths(res, "month", "count"));
    }).catch((err) => {
      console.log(err);
    });

    getRegistrationCounts().then((res) => {
      setPtData(addZeroMonths(res.patientCounts, "month", "count"));
      setDrData(addZeroMonths(res.doctorCounts, "month", "count"));
    }).catch((err) => {
      console.log(err);
    });
  }, []);


  const getSum = (data: any, key: string) => {
    return data.reduce((sum: number, item: any) => sum + item[key], 0);
  };


  const card = (
    name: string,
    id: string,
    color: string,
    bg: string,
    icon: React.ReactNode,
    data: any
  ) => {
    return (
      <div className={`${bg} rounded-xl `}>
        <div className="flex items-center p-5 justify-between gap-5">
          <ThemeIcon className="shadow-xl" size="xl" radius="md" color={color}>
            {icon}
          </ThemeIcon>
          <div className="flex flex-col font-medium items-end">
            <div>{name}</div>
            <div className="text-lg">{getSum(data, id)}</div>
          </div>
        </div>
        <AreaChart
          h={100}
          data={data}
          dataKey="month"
          series={[{ name: id, color: color }]}
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

  const cards = [
    {
      name: "Appointments",
      id: "count",
      color: "violet",
      bg: "bg-violet-100/50",
      icon: <IconFileReport />,
      data: apData,
    },
    {
      name: "Patients",
      id: "count",
      color: "orange",
      bg: "bg-orange-100/50",
      icon: <IconUser />,
      data: ptData,
    },
    {
      name: "Doctors",
      id: "count",
      color: "teal",
      bg: "bg-teal-100/50",
      icon: <IconStethoscope />,
      data: drData,
    },
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-5">
      {cards.map((cardData) =>
        card(
          cardData.name,
          cardData.id,
          cardData.color,
          cardData.bg,
          cardData.icon,
          cardData.data
        )
      )}
    </div>
  );
};

export default TopCards;
