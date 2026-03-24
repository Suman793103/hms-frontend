import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Fieldset,
  Grid,
  Group,
  LoadingOverlay,
  Modal,
  NumberInput,
  Select,
  SelectProps,
  TextInput,
  Title,
  Text,
  SegmentedControl,
} from "@mantine/core";
import {
  IconCheck,
  IconEye,
  IconHome,
  IconLayoutGrid,
  IconPlus,
  IconSearch,
  IconTable,
  IconTrash,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";

import {
  errorNotification,
  successNotification,
} from "../../../Utility/NotificationUtil";
import { useEffect, useState } from "react";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";

import { FilterMatchMode, FilterOperator } from "primereact/api";
import { getAllMedicines } from "../../../Service/MedicineService";
import {
  addSale,
  getAllSaleItems,
  getAllSales,
} from "../../../Service/SalesService";
import React from "react";
import { formateDate } from "../../../Utility/DateUtility";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { get } from "http";
import { spotlight, Spotlight, SpotlightActionData } from "@mantine/spotlight";
import {
  getAllMedicinesByPrescriptionId,
  getAllPrescriptions,
} from "../../../Service/AppointmentService";
import { frequencyMap } from "../../../Data/DropdownData";
import { Toolbar } from "primereact/toolbar";
import SaleCard from "./SaleCard";

interface SaleItem {
  medicineId: string;
  quantity: number;
}

const Sales = () => {
  const [view, setView] = useState("table");
  const matches = useMediaQuery("(max-width: 768px)");
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [medicine, setMedicine] = useState<any[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [medicineMap, setMedicineMap] = useState<Record<string, any>>({});

  const [actions, setActions] = useState<SpotlightActionData[]>([]);

  const form = useForm({
    initialValues: {
      buyerName: "",
      contactNumber: "",
      saleItems: [{ medicineId: "", quantity: 0 }] as SaleItem[],
    },
    validate: {
      saleItems: {
        medicineId: (value: any) => (value ? null : "Medicine is required"),
        quantity: (value: any) =>
          value > 0 ? null : "Quantity must be a positive number",
      },
    },
  });

  const fetchData = () => {
    getAllSales()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.log("Error fetching sales", err);
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
          }, {}),
        );
      })
      .catch((err) => {
        console.log("Error fetching medicines", err);
      });
    getAllPrescriptions()
      .then((res) => {
        setActions(
          res.map((item: any) => ({
            id: String(item.id),
            label: item.patientName,
            description: `Prescription by Dr. ${
              item.doctorName
            } on ${formateDate(item.prescriptionDate)}`,
            onClick: () => handleImport(item),
          })),
        );
      })
      .catch((err) => {
        console.log("Error fetching prescriptions", err);
      });
    fetchData();
  }, []);

  const handleImport = (item: any) => {
    setLoading(true);
    getAllMedicinesByPrescriptionId(item.id)
      .then((res) => {
        setSaleItems(res);
        form.setValues({
          buyerName: item.patientName,
          saleItems: res
            .filter((x: any) => x.medicineId != null)
            .map((x: any) => ({
              medicineId: String(x.medicineId),
              quantity: calculateQuantity(x.frequency, x.duration),
            })),
        });
        console.table(res);
      })
      .catch((err) => {
        console.log("Error fetching medicines", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const calculateQuantity = (freq: string, duration: number) => {
    const freqValue = frequencyMap[freq] || 0;
    return Math.ceil(freqValue * duration);
  };

  const handleSubmit = (values: any) => {
    let update = false;
    values.saleItems.forEach((item: any, index: number) => {
      if (item.quantity > (medicineMap[item.medicineId]?.stock || 0)) {
        update = true;
        form.setFieldError(
          `saleItems.${index}.quantity`,
          "Quantity exceeds available stock.",
        );
      }
    });
    if (update) {
      errorNotification("Quantity exceeds available stock.");
      return;
    }
    const saleItems = values.saleItems.map((x: any) => ({
      ...x,
      unitPrice: medicineMap[x.medicineId]?.unitPrice,
    }));

    const totalAmount = saleItems.reduce(
      (acc: number, item: any) => acc + item.unitPrice * item.quantity,
      0,
    );
    setLoading(true);
    addSale({ ...values, saleItems, totalAmount })
      .then((_res) => {
        successNotification("Medicine sold successfully.");
        form.reset();
        setEdit(false);
        fetchData();
      })
      .catch((err) => {
        errorNotification(
          err?.response?.data?.errorMessage || "Failed to sell medicine.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    buyerName: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  });

  const addMore = () => {
    form.insertListItem("saleItems", { medicineId: "", quantity: 0 });
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <Button variant="filled" onClick={() => setEdit(true)}>
          Sell Medicine
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

  const handleDetails = (rowData: any) => {
    open();
    setLoading(true);
    getAllSaleItems(rowData.id)
      .then((res) => {
        setSaleItems(res);
        console.log("Sale items fetched", res);
      })
      .catch((err) => {
        console.log("Error fetching sale items", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2 ">
        <ActionIcon onClick={() => handleDetails(rowData)}>
          <IconEye size={20} stroke={1.5} />
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
            {(option as any).manufacturer} - {(option as any).dosage}
          </span>
        )}
      </div>
      {checked && <IconCheck style={{ marginInlineStart: "auto" }} />}
    </Group>
  );

  const startToolbarTemplate = () => {
    return (
      <Button variant="filled" onClick={() => setEdit(true)}>
        Sell Medicine
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

  const handleImportPrescription = () => {
    spotlight.open();
  };

  return (
    <div>
      {!edit ? (
        <div>
          <Toolbar
            className="mb-4 !p-1"
            start={startToolbarTemplate}
            end={rightToolbarTemplate}
          ></Toolbar>
          {view === "table" && !matches ? (
            <DataTable
              stripedRows
              removableSort
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
              <Column field="buyerName" header="Buyer Name" />
              <Column field="contactNumber" header="Contact" />

              <Column field="prescription" header="Prescription" />
              <Column field="totalAmount" header="Total Amount" sortable />
              <Column
                field="saleDate"
                header="Sale Date"
                sortable
                body={(rowData) => formateDate(rowData.saleDate)}
              />
              <Column
                headerStyle={{ textAlign: "center" }}
                bodyStyle={{ textAlign: "center", overflow: "visible" }}
                body={actionBodyTemplate}
              />
            </DataTable>
          ) : (
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
              {data?.map((appointment) => (
                <SaleCard
                  key={appointment.id}
                  {...appointment}
                  onView={() => handleDetails(appointment)}
                />
              ))}
              {data?.length === 0 && (
                <div className="col-span-4 text-center text-gray-500">
                  No sales found.
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl text-primary-500 font-medium">
              Sell Medicine
            </h3>
            <Button
              variant="filled"
              leftSection={<IconPlus size={20} />}
              onClick={handleImportPrescription}
            >
              Import Prescription
            </Button>
          </div>
          <form onSubmit={form.onSubmit(handleSubmit)} className="grid gap-5">
            <LoadingOverlay visible={loading} />
            <Fieldset
              className="grid gap-5"
              legend={
                <span className="text-lg font-medium text-primary-500">
                  Buyer Information
                </span>
              }
              radius="md"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <TextInput
                  {...form.getInputProps("buyerName")}
                  label="Buyer Name"
                  placeholder="Enter buyer name"
                  withAsterisk
                />
                <NumberInput
                  {...form.getInputProps("contactNumber")}
                  label="Contact Number"
                  maxLength={10}
                  placeholder="Enter contact number"
                  withAsterisk
                />
              </div>
            </Fieldset>

            <Fieldset
              className="grid gap-5"
              legend={
                <span className="text-lg font-medium text-primary-500">
                  Medicine Information
                </span>
              }
              radius="md"
            >
              <div className="grid sm:grid-cols-5 gap-4">
                {form.values.saleItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <div className="col-span-2">
                      <Select
                        renderOption={renderSelectOption}
                        {...form.getInputProps(`saleItems.${index}.medicineId`)}
                        withAsterisk
                        label="Medicine"
                        placeholder="Select medicine"
                        data={medicine
                          .filter(
                            (x) =>
                              !form.values.saleItems.some(
                                (item1: any, idx) =>
                                  item1.medicineId == x.id && idx != index,
                              ),
                          )
                          .map((item) => ({
                            ...item,
                            value: "" + item.id,
                            label: item.name,
                          }))}
                      />
                    </div>

                    <div className="col-span-2">
                      <NumberInput
                        rightSectionWidth={80}
                        rightSection={
                          <div className="text-xs flex font-medium rounded-md gap-1 text-white bg-red-400 p-1">
                            Stock: {medicineMap[item.medicineId]?.stock}
                          </div>
                        }
                        {...form.getInputProps(`saleItems.${index}.quantity`)}
                        withAsterisk
                        min={0}
                        max={medicineMap[item.medicineId]?.stock || 0}
                        clampBehavior="strict"
                        label="Quantity"
                        placeholder="Enter quantity"
                      />
                    </div>
                    <div className="flex items-end justify-between">
                      {item.quantity && item.medicineId ? (
                        <div>
                          Total: {item.quantity} X{" "}
                          {medicineMap[item.medicineId]?.unitPrice} ={" "}
                          {item.quantity *
                            medicineMap[item.medicineId]?.unitPrice}
                        </div>
                      ) : (
                        <div></div>
                      )}
                      <ActionIcon
                        size="lg"
                        color="red"
                        onClick={() => form.removeListItem("saleItems", index)}
                      >
                        <IconTrash size={20} />
                      </ActionIcon>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <div className="flex items-center justify-center">
                <Button
                  variant="outline"
                  onClick={addMore}
                  leftSection={<IconPlus />}
                >
                  Add More
                </Button>
              </div>
            </Fieldset>

            <div className="flex items-center gap-5 justify-center">
              <Button
                loading={loading}
                type="submit"
                variant="filled"
                className="w-full"
                color="primary"
              >
                Sell Medicine
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
        </div>
      )}
      <Modal
        opened={opened}
        size="xl"
        onClose={close}
        title="Sold Medicine Details"
        centered
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {saleItems?.map((data: any, index: number) => (
            <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={4} mb="sm">
                {medicineMap[data.medicineId]?.name} -{" "}
                {medicineMap[data.medicineId]?.dosage}{" "}
                <span className="text-gray-600">
                  ({medicineMap[data.medicineId]?.manufacturer})
                </span>
              </Title>
              <Text color="dimmed" className="text-xs ">
                {data.batchNo}
              </Text>

              <Divider my="xs" />

              <Grid>
                <Grid.Col span={4}>
                  <Text size="sm" fw={500}>
                    Quantity:
                  </Text>
                  <Text>{data.quantity}</Text>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Text size="sm" fw={500}>
                    Unit Price:
                  </Text>
                  <Text>{data.unitPrice}</Text>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Text size="sm" fw={500}>
                    Total Amount:
                  </Text>
                  <Text>₹ {data.quantity * data.unitPrice}</Text>
                </Grid.Col>
              </Grid>
            </Card>
          ))}
        </div>
        {saleItems.length === 0 && (
          <Text color="dimmed" size="sm" mt="md">
            No medicines prescribed.
          </Text>
        )}
      </Modal>
      <Spotlight
        actions={actions}
        nothingFound="Nothing found..."
        highlightQuery
        searchProps={{
          leftSection: <IconSearch size={20} stroke={1.5} />,
          placeholder: "Search...",
        }}
      />
    </div>
  );
};

export default Sales;
