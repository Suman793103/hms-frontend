import { Avatar, Button, Divider } from "@mantine/core";
import React from "react";
import { bloodGroupsMap } from "../../../Data/DropdownData";
import {
  IconClock,
  IconEmergencyBed,
  IconMedicineSyrup,
  IconNote,
  IconQuestionMark,
  IconUserHeart,
} from "@tabler/icons-react";
import { formatDateWithTime, formateDate } from "../../../Utility/DateUtility";
import { Tag } from "primereact/tag";
import { useNavigate } from "react-router-dom";

const ReportCard = ({
  doctorName,
  notes,
  createdAt,
  diagonosis,
  appointmentId,
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
    <div className="border p-4 flex flex-col gap-2 hover:bg-primary-50 transition duration-300 ease-in-out rounded-xl hover:shadow-[0_0_5px_1px_blue] !shadow-primary-500 cursor-pointer space-y-2">
      <div className="flex text-xs items-center gap-2">
        <IconUserHeart
          size={24}
          className="text-primary-700 bg-primary-100 p-1 rounded-full"
        />
        <div>{doctorName}</div>
      </div>
      <div className="flex text-xs items-center gap-2">
        <IconQuestionMark
          size={24}
          className="text-primary-700 bg-primary-100 p-1 rounded-full"
        />
        <div>{diagonosis}</div>
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
        <IconClock
          size={24}
          className="text-primary-700 bg-primary-100 p-1 rounded-full"
        />
        <div>{formateDate(createdAt)}</div>
      </div>
    </div>
  );
};

export default ReportCard;
