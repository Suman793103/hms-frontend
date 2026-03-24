import { Avatar, Divider } from "@mantine/core";
import React from "react";
import { bloodGroupsMap } from "../../../Data/DropdownData";
import { IconCalendarHeart, IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";

const PatientCard = ({ name, email, dob, phone, address, bloodGroup }: any) => {
  const getAge = (dob: string) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  return (
    <div className="border p-4 flex flex-col gap-2 hover:bg-primary-50 transition duration-300 ease-in-out rounded-xl hover:shadow-[0_0_5px_1px_blue] !shadow-primary-500 cursor-pointer space-y-2">
      <div className="flex items-center gap-3">
        <Avatar size="lg" name={name} color="initials" variant="filled" />
        <div>
          <div className="text-sm">{name}</div>
          <div className="text-xs text-gray-500">
            {bloodGroupsMap[bloodGroup]} 
          </div>
        </div>
      </div>
      <Divider my="xs" />
      <div className="flex text-xs items-center gap-2">
        <IconMail
          size={24}
          className="text-primary-700 bg-primary-100 p-1 rounded-full"
        />
        <div>{email}</div>
      </div>
      <div className="flex text-xs items-center gap-2">
        <IconPhone
          size={24}
          className="text-primary-700 bg-primary-100 p-1 rounded-full"
        />
        <div>{phone}</div>
      </div>
      <div className="flex text-xs items-center gap-2">
        <IconMapPin
          size={24}
          className="text-primary-700 bg-primary-100 p-1 rounded-full"
        />
        <div>{address}</div>
      </div>
      <div className="flex text-xs items-center gap-2">
        <IconCalendarHeart
          size={24}
          className="text-primary-700 bg-primary-100 p-1 rounded-full"
        />
        <div>{dob && getAge(dob) ? getAge(dob) + " years" : "N/A"}</div>
      </div>
    </div>
  );
};

export default PatientCard;
