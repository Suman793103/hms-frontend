import { get } from "http";
import React, { use, useEffect } from "react";
import { getAllPatients } from "../../../Service/PatientProfileService";
import DoctorCard from "./DoctorCard";
import { getAllDoctors } from "../../../Service/DoctorProfileService";

const Doctors = () => {
  const [doctors, setDoctors] = React.useState<any[]>([]);

  useEffect(() => {
    getAllDoctors().then((data) => {
      console.log(data);
      setDoctors(data);
    });
  }, []);

  return (
    <div>
      <div className="text-xl text-primary-500 font-semibold mb-5">Doctors</div>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
        {
            doctors.map((doctor) => (
                <DoctorCard
                    key={doctor.id} {...doctor}
                />
            ))
        }
      </div>
    </div>
  );
};

export default Doctors;
