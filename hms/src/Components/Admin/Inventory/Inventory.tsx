import {
  ActionIcon,
  Badge,
  Button,
  Fieldset,
  Group,
  NumberInput,
  SegmentedControl,
  Select,
  SelectProps,
  TextInput,
} from "@mantine/core";
import { IconCheck, IconEdit, IconLayoutGrid, IconSearch, IconTable } from "@tabler/icons-react";
import { useForm } from "@mantine/form";

import {
  errorNotification,
  successNotification,
} from "../../../Utility/NotificationUtil";
import { useEffect, useState } from "react";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";

import { FilterMatchMode, FilterOperator } from "primereact/api";
import {
  getAllMedicines,
} from "../../../Service/MedicineService";
import { DateInput } from "@mantine/dates";
import {
  addStock,
  getAllStock,
  updateStock,
} from "../../../Service/InventoryService";
import { Toolbar } from "primereact/toolbar";
import InvCard from "./InvCard";
import { useMediaQuery } from "@mantine/hooks";

const Inventory = () => {
  const matches = useMediaQuery("(max-width: 768px)");
  const [view, setView] = useState("table");
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [medicine, setMedicine] = useState<any[]>([]);
  const [medicineMap, setMedicineMap] = useState<Record<string, any>>({});
  const form = useForm({
    initialValues: {
      id: null,
      medicineId: "",
      batchNo: "",
      quantity: 0,
      expiryDate: "",
    },
    validate: {
      medicineId: (value: any) => (value ? null : "Medicine is required"),
      batchNo: (value: any) => (value ? null : "Batch number is required"),
      quantity: (value: any) =>
        value >= 0 ? null : "Quantity must be a non-negative number",
      expiryDate: (value: any) => (value ? null : "Expiry date is required"),
    },
  });

  const fetchData = () => {
    getAllStock()
      .then((res) => {
        setData(res);
        console.log(res);
      })
      .catch((err) => {
        console.log("Error fetching stocks", err);
      });
  };

  useEffect(() => {
    getAllMedicines()
      .then((res) => {
        setMedicine(res);
        setMedicineMap(
          res.reduce((acc: any, item: any) => {
            acc[item.id] = item;
            return acc;
          }, {})
        );
        console.log(res);
      })
      .catch((err) => {
        console.log("Error fetching medicines", err);
      });
    fetchData();
  }, []);

  const handleSubmit = (values: any) => {
    console.log("Form values:", values);
    let update = false;
    let method;
    if (values.id) {
      update = true;
      method = updateStock;
    } else {
      method = addStock;
    }
    setLoading(true);
    method(values)
      .then((_res) => {
        successNotification(
          `Stock ${update ? "updated" : "added"} successfully.`
        );
        form.reset();
        setEdit(false);
        fetchData();
      })
      .catch((err) => {
        errorNotification(
          err?.response?.data?.errorMessage ||
            `Failed to ${update ? "update" : "add"} stock.`
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    doctorName: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  });

  const renderHeader = () => {
    return (
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <Button variant="filled" onClick={() => setEdit(true)}>
          Add Stock
        </Button>

        <TextInput
          leftSection={<IconSearch />}
          fw={500}
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
        />
      </div>
    );
  };

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters: any = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const onEdit = (rowData: any) => {
    setEdit(true);
    form.setValues({
      ...rowData,
      medicineId: "" + rowData.medicineId,
      batchNo: rowData.batchNo,
      quantity: rowData.quantity,
      expiryDate: new Date(rowData.expiryDate),
    });
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2 ">
        <ActionIcon onClick={() => onEdit(rowData)}>
          <IconEdit />
        </ActionIcon>
      </div>
    );
  };

  const cancel = () => {
    form.reset();
    setEdit(false);
  };

  const renderSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => (
    <Group flex="1" gap="xs">
      <div className="flex gap-2 items-center">
        {option.label}
        {(option as any)?.manufacturer && (
          <span
            style={{ marginLeft: "auto", fontSize: "0.8rem", color: "gray" }}
          >
            {(option as any).manufacturer}
          </span>
        )}
      </div>
      {checked && <IconCheck style={{ marginInlineStart: "auto" }} />}
    </Group>
  );

  const startToolbarTemplate = () => {
    return (
      <Button variant="filled" onClick={() => setEdit(true)}>
        Add Stock
      </Button>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <div className="md:flex hidden flex-wrap gap-2 justify-end items-center">
        <SegmentedControl
          value={view}
          size={matches ? "xs" : "md"}
          color="primary"
          onChange={setView}
          data={[
            { label: <IconTable />, value: "table" },
            { label: <IconLayoutGrid />, value: "grid" },
          ]}
        />
        <TextInput
          className="lg:block hidden"
          leftSection={<IconSearch />}
          fw={500}
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
        />
      </div>
    );
  };

  const statusBodyTemplate = (rowData: any) => {
    const isExpired = new Date(rowData.expiryDate) < new Date();
    return (
      <Badge color={isExpired ? "red" : "green"}>
        {isExpired ? "Expired" : "Valid"}
      </Badge>
    );
  };

  return (
    <div>
          {!edit ? <div>
                  <Toolbar
                          className="mb-4 !p-1"
                          start={startToolbarTemplate}
                          end={rightToolbarTemplate}
                        ></Toolbar>
        {view === "table" && !matches ?
        <DataTable
          stripedRows
          value={data}
          size="small"
          paginator
          rows={10}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          rowsPerPageOptions={[10, 25, 50]}
          dataKey="id"
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={["doctorName", "notes"]}
          emptyMessage="No records found."
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        >
          <Column
            field="name"
            header="Medicine"
            body={(rowData) => (
              <span>
                {medicineMap["" + rowData.medicineId]?.name}{" "}
                <span className=" text-xs text-gray-700 gap-2">
                  {medicineMap["" + rowData.medicineId]?.manufacturer}{" "}
                </span>
              </span>
            )}
          />
          <Column field="batchNo" header="Batch Number" />
          <Column field="initialQuantity" header="Quantity" />
          <Column field="quantity" header="Available Quantity" />
          <Column field="expiryDate" header="Expiry Date" />
          <Column field="status" header="Status" body={statusBodyTemplate} />
          <Column
            headerStyle={{ textAlign: "center" }}
            bodyStyle={{ textAlign: "center", overflow: "visible" }}
            body={actionBodyTemplate}
          />
        </DataTable> :
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
                  {data?.map((appointment) => (
                    <InvCard key={appointment.id}
                      {...appointment} medicineMap={medicineMap} onEdit={() => onEdit(appointment)} />
                  ))}
                  {data?.length === 0 && (
                    <div className="col-span-4 text-center text-gray-500">
                      No Inventory found.
                    </div>
                  )}
                </div>}
        </div>
       : (
        <form onSubmit={form.onSubmit(handleSubmit)} className="grid gap-5">
          <Fieldset
            className="grid sm:grid-cols-2 gap-4"
            legend={
              <span className="text-lg font-medium text-primary-500">
                Inventory information
              </span>
            }
            radius="md"
          >
            <Select
              renderOption={renderSelectOption}
              {...form.getInputProps("medicineId")}
              withAsterisk
              label="Medicine"
              placeholder="Select medicine"
              data={medicine.map((item) => ({
                ...item,
                value: "" + item.id,
                label: item.name,
              }))}
            />

            <TextInput
              {...form.getInputProps("batchNo")}
              withAsterisk
              label="Batch Number"
              placeholder="Enter batch number"
            />

            <NumberInput
              {...form.getInputProps("quantity")}
              withAsterisk
              min={0}
              clampBehavior="strict"
              label="Quantity"
              placeholder="Enter quantity"
            />

            <DateInput
              {...form.getInputProps("expiryDate")}
              withAsterisk
              minDate={new Date()}
              label="Expiry Date"
              placeholder="Select expiry date"
            />
          </Fieldset>

          <div className="flex items-center gap-5 justify-center">
            <Button
              loading={loading}
              type="submit"
              variant="filled"
              className="w-full"
              color="primary"
            >
              {form.values?.id ? "Update" : "Add"}
              Stock
            </Button>
            <Button
              loading={loading}
              onClick={cancel}
              variant="filled"
              className="w-full "
              color="red"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Inventory;
