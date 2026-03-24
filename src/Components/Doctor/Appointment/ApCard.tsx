import { Avatar, Divider } from "@mantine/core";
import React from "react";
import { bloodGroupsMap } from "../../../Data/DropdownData";
import {
  IconCalendarHeart,
  IconClock,
  IconEmergencyBed,
  IconMail,
  IconMapPin,
  IconNote,
  IconPhone,
  IconProgress,
  IconUser,
  IconUserHeart,
} from "@tabler/icons-react";
import { formatDateWithTime } from "../../../Utility/DateUtility";
import { Tag } from "primereact/tag";
import { useNavigate } from "react-router-dom";

const ApCard = ({
  id,
  patientName,
  patientPhone,
  notes,
  reason,
  status,
  appointmentTime,
  appointmentId
}: any) => {
  const navigate = useNavigate();
  const getSeverity = (status: any) => {
    switch (status) {
      case "CANCELLED":
        return "danger";

      case "COMPLETED":
        return "success";

      case "SCHEDULED":
        return "info";

      case "":
        return "warning";

      default:
        return null;
    }
  };
  return (
    <div
      onClick={() => navigate("" + id)}
      className="border p-4 flex flex-col gap-2 hover:bg-primary-50 transition duration-300 ease-in-out rounded-xl hover:shadow-[0_0_5px_1px_blue] !shadow-primary-500 cursor-pointer space-y-2"
    >
      <div className="flex text-xs items-center gap-2">
        <IconUserHeart
          size={24}
          className="text-primary-700 bg-primary-100 p-1 rounded-full"
        />
        <div>{patientName}</div>
      </div>
      <div className="flex text-xs items-center gap-2">
        <IconPhone
          size={24}
          className="text-primary-700 bg-primary-100 p-1 rounded-full"
        />
        <div>+91 {patientPhone}</div>
      </div>
      {notes && (
        <div className="flex text-xs items-center gap-2">
          <IconNote
            size={24}
            className="text-primary-700 bg-primary-100 p-1 rounded-full"
          />
          <div>{notes}</div>
        </div>
      )}
      <div className="flex text-xs items-center gap-2">
        <IconEmergencyBed
          size={24}
          className="text-primary-700 bg-primary-100 p-1 rounded-full"
        />
        <div>{reason}</div>
      </div>
      <div className="flex text-xs items-center gap-2">
        <IconClock
          size={24}
          className="text-primary-700 bg-primary-100 p-1 rounded-full"
        />
        <div>{formatDateWithTime(appointmentTime)}</div>
      </div>
      <div className="flex text-xs items-center gap-2">
        <IconProgress
          size={24}
          className="text-primary-700 bg-primary-100 p-1 rounded-full"
        />
        <Tag value={status} severity={getSeverity(status)} />
      </div>
    </div>
  );
};

export default ApCard;
