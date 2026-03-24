import React, { use, useEffect, useState } from "react";
import { AreaChart } from "@mantine/charts";
import {
  appointments,
  data,
  doctorData,
  medicines,
  patientData,
} from "../../../Data/DashboardData";
import { ScrollArea, ThemeIcon } from "@mantine/core";
import { getAllMedicines } from "../../../Service/MedicineService";

const Medicines = () => {

  const [data, setData] = useState<any[]>(medicines);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getAllMedicines().then((res) => {
      setData(res);
    }).catch((err) => {
      console.log("Error fetching medicines", err);
    });
  };

  const card = (med: any) => {
    return (
      <div
        className="p-3 mb-3 border rounded-xl justify-between border-l-4 border-orange-500 flex shadow-md bg-orange-100"
        key={med.id}
      >
        <div>
          <div className="font-medium text-sm">{med.name}</div>
          <div className="text-xs text-gray-500">{med.manufacturer}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">{med.dosage}</div>
          <div className="text-xs text-gray-500">Stock: {med.stock}</div>
        </div>
      </div> 
    );
  };

  return (
    <div className="p-3 border rounded-xl bg-violet-50 shadow-xl flex flex-col gap-3">
      <div className="text-xl font-semibold">Medicines</div>
      <div>
        <ScrollArea.Autosize mah={300} mx="auto">
          {data.map((med) => card(med))}
        </ScrollArea.Autosize>
      </div>
    </div>
  );
};

export default Medicines;
