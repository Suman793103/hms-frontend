import { DonutChart } from "@mantine/charts";
import React, { useEffect, useState } from "react";
import { diseaseData } from "../../../Data/DashboardData";
import { countAllReasons, countReasonsByDoctor } from "../../../Service/AppointmentService";
import { colorResolver } from "@mantine/core/lib/core/Box/style-props/resolvers/color-resolver/color-resolver";
import { convertReasonChartData } from "../../../Utility/OtherUtility";
import { useSelector } from "react-redux";

const DiseaseChart = () => {
  const [data, setData] = useState<any[]>(diseaseData);
  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    countReasonsByDoctor(user.profileId).then((res) => {
        setData(convertReasonChartData(res));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="p-3 border rounded-xl bg-green-50 shadow-xl flex flex-col gap-3">
      <div className="text-xl font-semibold">Reason Distribution</div>
      <div className="flex justify-center">
        <DonutChart
          withLabelsLine
          size={200}
          paddingAngle={10}
          labelsType="percent"
          withLabels
          data={data}
          chartLabel="Disease"
        />
      </div>
    </div>
  );
};

export default DiseaseChart;
