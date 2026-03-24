import { Avatar, Divider } from "@mantine/core";
import { IconBriefcase, IconMail, IconMap, IconMapPin, IconPhone } from "@tabler/icons-react";
import React from "react";

const DoctorCard = ({
  name,
  email,
  dob,
  phone,
  address,
  specialization,
  department,
  totalExp,
}: any) => {
  return (
    <div className="border p-4 flex flex-col gap-2 hover:bg-primary-50 transition duration-300 ease-in-out rounded-xl hover:shadow-[0_0_5px_1px_blue] !shadow-primary-500 cursor-pointer space-y-2">
      <div className="flex items-center gap-3">
        <Avatar size="lg" name={name} color="initials" variant="filled" />
        <div>
          <div className="text-sm">{name}</div>
          <div className="text-xs text-gray-500">
            {specialization} &bull; {department}
          </div>
        </div>
      </div>
      <Divider my="xs"/>
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
        <IconBriefcase
          size={24}
          className="text-primary-700 bg-primary-100 p-1 rounded-full"
        />
        <div>{totalExp} years</div>
      </div>
    </div>
  );
};

export default DoctorCard;
