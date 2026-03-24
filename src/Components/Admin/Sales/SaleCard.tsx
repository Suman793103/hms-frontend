import {
    IconCalendar,
  IconCurrencyRupee,
  IconMedicineSyrup,
  IconPhone,
  IconPills,
  IconStack2,
  IconUserHeart,
  IconVaccine,
} from "@tabler/icons-react";
import { formateDate } from "../../../Utility/DateUtility";

const SaleCard = ({ contactNumber, saleDate, buyerName, totalAmount, onView }: any) => {
  return (
    <div onClick={onView} className="border p-4 flex flex-col gap-2 hover:bg-primary-50 transition duration-300 ease-in-out rounded-xl hover:shadow-[0_0_5px_1px_blue] !shadow-primary-500 cursor-pointer space-y-2">
      <div className="flex text-xs items-center gap-2">
        <IconUserHeart
          size={24}
          className="text-primary-700 bg-primary-100 p-1 rounded-full"
        />
        <div>{buyerName}</div>
      </div>
      <div className="flex text-xs items-center gap-2">
        <IconPhone
          size={24}
          className="text-primary-700 bg-primary-100 p-1 rounded-full"
        />
        <div>{contactNumber}</div>
      </div>
      <div className="flex text-xs items-center gap-2">
        <IconCalendar
          size={24}
          className="text-primary-700 bg-primary-100 p-1 rounded-full"
        />
        <div>{formateDate(saleDate)}</div>
      </div>
      <div className="flex text-xs items-center gap-2">
        <IconCurrencyRupee
          size={24}
          className="text-primary-700 bg-primary-100 p-1 rounded-full"
        />
        <div>Total: ₹{totalAmount}</div>
      </div>
    </div>
  );
};

export default SaleCard;
