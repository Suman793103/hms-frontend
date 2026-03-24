import {
  IconCurrencyRupee,
  IconMedicineSyrup,
  IconPills,
  IconStack2,
  IconVaccine,
} from "@tabler/icons-react";
import { formateDate } from "../../../Utility/DateUtility";

const InvCard = ({
  id,
  medicineId,
  quantity,
  initialQuantity,
  status,
  batchNo,
  expiryDate,
  medicineMap,
  onEdit,
}: any) => {
  return (
    <div
      onClick={onEdit}
      className="border p-4 flex flex-col gap-2 hover:bg-primary-50 transition duration-300 ease-in-out rounded-xl hover:shadow-[0_0_5px_1px_blue] !shadow-primary-500 cursor-pointer space-y-2"
    >
      <div className="flex text-xs items-center gap-2">
        <IconPills
          size={24}
          className="text-primary-700 bg-primary-100 p-1 rounded-full"
        />
        <div>
          {medicineMap[medicineId]?.name || "Unknown Medicine"}{" "}
          <span className="text-gray-500">
            ({medicineMap[medicineId]?.manufacturer})
          </span>
        </div>
      </div>
      <div className="flex text-xs items-center gap-2">
        <IconPills
          size={24}
          className="text-primary-700 bg-primary-100 p-1 rounded-full"
        />
        <div>{batchNo}</div>
      </div>
      <div className="flex text-xs items-center gap-2">
        <IconStack2
          size={24}
          className="text-primary-700 bg-primary-100 p-1 rounded-full"
        />
        <div>Stock: {quantity}</div>
      </div>
      <div className="flex text-xs items-center gap-2">
        <IconMedicineSyrup
          size={24}
          className="text-primary-700 bg-primary-100 p-1 rounded-full"
        />
        <div
          className={status === "EXPIRED" ? "text-red-600 font-semibold" : ""}
        >
          {status}
        </div>
      </div>
      <div className="flex text-xs items-center gap-2">
        <IconVaccine
          size={24}
          className="text-primary-700 bg-primary-100 p-1 rounded-full"
        />
        <div
          className={status === "EXPIRED" ? "text-red-600 font-semibold" : ""}
        >
          {formateDate(expiryDate)}
        </div>
      </div>
    </div>
  );
};

export default InvCard;
