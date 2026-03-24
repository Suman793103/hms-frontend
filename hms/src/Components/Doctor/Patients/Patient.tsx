import { get } from "http";
import React, { use, useEffect } from "react";
import { getAllPatients } from "../../../Service/PatientProfileService";
import PatientCard from "./PatientCard";

const Patient = () => {
  const [patients, setPatients] = React.useState<any[]>([]);

  useEffect(() => {
    getAllPatients().then((data) => {
      console.log(data);
      setPatients(data);
    });
  }, []);

  return (
    <div>
      <div className="text-xl text-primary-500 font-semibold mb-5">Patients</div>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
        {
            patients.map((patient) => (
                <PatientCard
                    key={patient.id} {...patient}
                />
            ))
        }
      </div>
    </div>
  );
};

export default Patient;
