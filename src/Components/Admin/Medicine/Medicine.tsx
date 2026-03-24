import {
  ActionIcon,
  Button,
  Fieldset,
  NumberInput,
  SegmentedControl,
  Select,
  TextInput,
} from "@mantine/core";
import { medicineCategories, medicineTypes } from "../../../Data/DropdownData";
import { IconEdit, IconLayoutGrid, IconSearch, IconTable} from "@tabler/icons-react";
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
  addMedicine,
  getAllMedicines,
  updateMedicine,
} from "../../../Service/MedicineService";
import { capitalizeFirstLetter } from "../../../Utility/OtherUtility";
import { Toolbar } from "primereact/toolbar";
import MedCard from "./MedCard";
import { useMediaQuery } from "@mantine/hooks";

const Medicine = () => {
  const matches = useMediaQuery("(max-width: 768px)");
  const [view, setView] = useState("table");
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const form = useForm({
    initialValues: {
      id: null,
      name: "",
      dosage: "",
      category: "",
      type: "",
      manufacturer: "",
      unitPrice: 0,
    },
    validate: {
      name: (value: any) => (value ? null : "Medicine name is required"),
      dosage: (value: any) => (value ? null : "Dosage is required"),
      category: (value: any) => (value ? null : "Category is required"),
      type: (value: any) => (value ? null : "Type is required"),
      manufacturer: (value: any) => (value ? null : "Manufacturer is required"),
      unitPrice: (value: any) =>
        value && !isNaN(Number(value)) ? null : "Valid unit price is required",
    },
  });

  const fetchData = () => {
    getAllMedicines()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.log("Error fetching medicines", err);
      });
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = (values: any) => {
    console.log("Form values:", values);
    let update = false;
    let method;
    if (values.id) {
      update = true;
      method = updateMedicine;
    } else {
      method = addMedicine;
    }
    setLoading(true);
    method(values)
      .then((_res) => {
        successNotification(
          `Medicine ${update ? "updated" : "added"} successfully.`
        );
        form.reset();
        setEdit(false);
        fetchData();
      })
      .catch((err) => {
        errorNotification(
          err?.response?.data?.errorMessage ||
            `Failed to ${update ? "update" : "add"} medicine.`
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
          Add Medicine
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
      name: rowData.name,
      dosage: rowData.dosage,
      category: rowData.category,
      type: rowData.type,
      manufacturer: rowData.manufacturer,
      unitPrice: rowData.unitPrice,
    });
  };

  const startToolbarTemplate = () => {
    return (
      <Button variant="filled" onClick={() => setEdit(true)}>
          Add Medicine
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
          emptyMessage="No appointments found."
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        >
          <Column field="name" header="Medicine Name" />
          <Column field="dosage" header="Dosage" />
          <Column field="stock" header="Stock" />
          <Column
            field="category"
            header="Category"
            body={(rowData) => capitalizeFirstLetter(rowData.category)}
          />
          <Column
            field="type"
            header="Type"
            body={(rowData) => capitalizeFirstLetter(rowData.type)}
          />
          <Column field="manufacturer" header="Manufacturer" />
          <Column
            field="unitPrice"
            header="Unit Price"
            sortable
            body={(rowData) => `₹ ${rowData.unitPrice}`}
          />
          <Column
            headerStyle={{ textAlign: "center" }}
            bodyStyle={{ textAlign: "center", overflow: "visible" }}
            body={actionBodyTemplate}
          />
        </DataTable> :
                <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
                  {data?.map((appointment) => (
                    <MedCard key={appointment.id}
                      {...appointment} onEdit={() => onEdit(appointment)} />
                  ))}
                  {data?.length === 0 && (
                    <div className="col-span-4 text-center text-gray-500">
                      No Medicines found.
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
                Medicine information
              </span>
            }
            radius="md"
          >
            <TextInput
              {...form.getInputProps("name")}
              withAsterisk
              label="Medicine Name"
              placeholder="Enter medicine name"
            />

            <TextInput
              {...form.getInputProps("dosage")}
              label="Dosage"
              placeholder="Enter dosage"
            />

            <Select
              {...form.getInputProps("category")}
              withAsterisk
              label="Category"
              placeholder="Select category"
              data={medicineCategories}
            />

            <Select
              {...form.getInputProps("type")}
              withAsterisk
              label="Type"
              placeholder="Select type"
              data={medicineTypes}
            />

            <TextInput
              {...form.getInputProps("manufacturer")}
              withAsterisk
              label="Manufacturer"
              placeholder="Enter manufacturer"
            />

            <NumberInput
              {...form.getInputProps("unitPrice")}
              withAsterisk
              min={0}
              clampBehavior="strict"
              label="Unit Price"
              placeholder="Enter unit price"
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
              Medicine
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

export default Medicine;
