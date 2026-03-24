import { Avatar } from "@mantine/core";
import React, { use, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useProtectedImage from "../../Utility/Dropzone/useProtectedImage";
import { getUserProfile } from "../../../Service/UserService";
import { getPatient } from "../../../Service/PatientProfileService";
import { bloodGroupsMap } from "../../../Data/DropdownData";

const Welcome = () => {
  const user = useSelector((state: any) => state.user);
  const [picId, setPicId] = useState<string | null>(null);
  const [patientInfo, setPatientInfo] = useState<any>({});

  useEffect(() => {
    if (!user) return;
    getUserProfile(user.id)
      .then((data) => {
        setPicId(data);
      })
      .catch((error) => {
        console.log(error);
      });
    getPatient(user.profileId)
      .then((data) => {
        setPatientInfo(data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const url = useProtectedImage(picId);

  return (
    <div className="p-5 border shadow-sm rounded-xl bg-blue-50 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div>
          <div>Welcome Back</div>
          <div className="text-3xl font-semibold text-blue-600">
            {user.name}!
          </div>
          <div className="text-sm text-gray-600">
            {bloodGroupsMap[patientInfo.bloodGroup]}, {patientInfo.address}
          </div>
        </div>
        <Avatar variant="filled" src={url} size={100} alt="it's me" />
      </div>
      <div className="flex gap-5">
        <div className="p-3 rounded-xl bg-violet-200">
          <div className="text-sm">Visits</div>
          <div className="text-lg font-semibold text-violet-600">120+</div>
        </div>
        <div className="p-3 rounded-xl bg-orange-200">
          <div className="text-sm">Medications</div>
          <div className="text-lg font-semibold text-orange-600">100+</div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
