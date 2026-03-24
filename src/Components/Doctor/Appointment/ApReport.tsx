import {
  ActionIcon,
  Button,
  Fieldset,
  Group,
  MultiSelect,
  NumberInput,
  SegmentedControl,
  Select,
  SelectProps,
  Textarea,
  TextInput,
} from "@mantine/core";
import {
  dosageFrequencies,
  medicineTypes,
  symptoms,
  tests,
} from "../../../Data/DropdownData";
import {
  IconCheck,
  IconLayoutGrid,
  IconSearch,
  IconTable,
  IconTrash,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import {
  createAppointmentReport,
  getReportsByPatientId,
  isReportExists,
} from "../../../Service/AppointmentService";
import {
  errorNotification,
  successNotification,
} from "../../../Utility/NotificationUtil";
import { useDispatch } from "react-redux";
import { use, useCallback, useEffect, useState } from "react";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { formateDate } from "../../../Utility/DateUtility";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { useNavigate } from "react-router-dom";
import { getAllMedicines } from "../../../Service/MedicineService";
import { Toolbar } from "primereact/toolbar";
import ReportCard from "./ReportCard";
import { useMediaQuery } from "@mantine/hooks";

type Medicine = {
  name: string | null;
  medicineId?: string | null;
  dosage: string | null | undefined;
  frequency: string | number | null;
  duration: number;
  route: string | null;
  type: string | null;
  instruction: string | null;
  prescriptionId?: number;
};

const ApReport = ({ appointment }: any) => {
  const [view, setView] = useState("table");
  const matches = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [allowAdd, setAllowAdd] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [medicine, setMedicine] = useState<any[]>([]);
  const [medicineMap, setMedicineMap] = useState<Record<string, any>>({});

  const form = useForm({
    initialValues: {
      symptoms: [],
      tests: [],
      diagnosis: "",
      referral: "",
      notes: "",
      prescription: {
        notes: "",
        medicines: [] as Medicine[],
      },
    },
    validate: {
      symptoms: (value: any) =>
        value.length > 0 ? null : "Select at least one symptom",
      diagnosis: (value: any) =>
        value.trim() ? null : "Diagnosis is required",
      prescription: {
        medicines: {
          name: (value: any) =>
            value.trim() ? null : "Medicine name is required",
          dosage: (value: any) => (value.trim() ? null : "Dosage is required"),
          frequency: (value: any) =>
            value.trim() ? null : "Frequency is required",
          duration: (value: any) =>
            value > 0 ? null : "Duration should be greater than zero",
          // route: (value: any) => (value.trim() ? null : "Route is required"),
          type: (value: any) => (value.trim() ? null : "Type is required"),
          instruction: (value: any) =>
            value.trim() ? null : "Instruction is required",
        },
      },
    },
  });

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
  }, []);

  const insertMedicine = () => {
    form.insertListItem("prescription.medicines", {
      name: "",
      dosage: "",
      frequency: "",
      duration: 0,
      route: "",
      type: "",
      instruction: "",
    });
  };

  const removeMedicine = (index: number) => {
    form.removeListItem("prescription.medicines", index);
  };

  const fetchData = useCallback(() => {
    if (!appointment?.patientId || !appointment?.id) return;

    getReportsByPatientId(appointment.patientId)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.log("Error fetching reports", err);
      });
    isReportExists(appointment.id)
      .then((res) => {
        setAllowAdd(!res);
        console.log("Report existence checked", res);
      })
      .catch((err) => {
        console.log("Error checking report existence", err);
        setAllowAdd(true);
      });
  }, [appointment?.patientId, appointment?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = (values: typeof form.values) => {
    console.log("Form Values:", values);
    let data = {
      ...values,
      doctorId: appointment.doctorId,
      patientId: appointment.patientId,
      appointmentId: appointment.id,
      prescription: {
        medicines: values.prescription.medicines.map((med) => ({
          ...med,
          medicineId: med.medicineId === "OTHER" ? null : med.medicineId,
        })),
        doctorId: appointment.doctorId,
        patientId: appointment.patientId,
        appointmentId: appointment.id,
      },
    };
    setLoading(true);
    createAppointmentReport(data)
      .then((res) => {
        successNotification("Appointment report created successfully");
        form.reset();
        setEdit(false);
        setAllowAdd(false);
        fetchData();
      })
      .catch((err) => {
        errorNotification(
          err?.response?.data?.errorMessage ||
            "Error creating appointment report",
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
        {allowAdd && (
          <Button variant="filled" onClick={() => setEdit(true)}>
            Add Report
          </Button>
        )}

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

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters: any = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const handleChangeMed = (medId: any, index: number) => {
    if (medId && medId !== "OTHER") {
      form.setFieldValue(`prescription.medicines.${index}.medicineId`, medId);
      form.setFieldValue(
        `prescription.medicines.${index}.name`,
        medicineMap[medId]?.name || "",
      );

      form.setFieldValue(
        `prescription.medicines.${index}.dosage`,
        medicineMap[medId]?.dosage || "",
      );

      form.setFieldValue(
        `prescription.medicines.${index}.type`,
        medicineMap[medId]?.type || "",
      );

      form.setFieldValue(
        `prescription.medicines.${index}.route`,
        medicineMap[medId]?.route || "",
      );
    } else {
      form.setFieldValue(`prescription.medicines.${index}.medicineId`, "OTHER");
      form.setFieldValue(`prescription.medicines.${index}.name`, null);

      form.setFieldValue(`prescription.medicines.${index}.dosage`, "");

      form.setFieldValue(`prescription.medicines.${index}.type`, null);

      form.setFieldValue(`prescription.medicines.${index}.route`, null);
    }
  };

  const rightToolbarTemplate = () => {
    return (
      <div className="md:flex hidden flex-wrap gap-5 justify-end items-center">
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

  const startToolbarTemplate = () => {
    return (
      allowAdd && (
        <Button variant="filled" onClick={() => setEdit(true)}>
          Add Report
        </Button>
      )
    );
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
          {view == "table" && !matches ? (
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
              <Column field="doctorName" header="Doctor" />
              <Column field="diagnosis" header="Diagnosis" sortable />
              <Column
                field="reportDate"
                header="Report Date"
                sortable
                body={(rowData) => formateDate(rowData.createdAt)}
              />
              <Column field="notes" header="Notes" />
            </DataTable>
          ) : (
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
              {data?.map((appointment) => (
                <ReportCard key={appointment.id} {...appointment} />
              ))}
              {data?.length === 0 && (
                <div className="col-span-4 text-center text-gray-500">
                  No Report found.
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={form.onSubmit(handleSubmit)} className="grid gap-5">
          <Fieldset
            className="grid grid-cols-2 gap-4"
            legend={
              <span className="text-lg font-medium text-primary-500">
                Personal information
              </span>
            }
            radius="md"
          >
            <MultiSelect
              {...form.getInputProps("symptoms")}
              className="col-span-2"
              withAsterisk
              label="Symptoms"
              placeholder="Select symptoms"
              data={symptoms}
            />

            <MultiSelect
              {...form.getInputProps("tests")}
              className="col-span-2"
              label="Tests"
              placeholder="Select tests"
              data={tests}
            />

            <TextInput
              {...form.getInputProps("diagnosis")}
              withAsterisk
              className="col-span-2 sm:col-span-1"
              label="Diagnosis"
              placeholder="Enter diagnosis"
            />

            <TextInput
              {...form.getInputProps("referral")}
              label="Referral"
              className="col-span-2 sm:col-span-1"
              placeholder="Enter referral"
            />

            <Textarea
              {...form.getInputProps("notes")}
              className="col-span-2"
              label="Notes"
              placeholder="Enter additional notes"
            />
          </Fieldset>

          <Fieldset
            className="grid gap-5"
            legend={
              <span className="text-lg font-medium text-primary-500">
                Prescription
              </span>
            }
            radius="md"
          >
            {form.values.prescription.medicines.map(
              (med: Medicine, index: number) => (
                <Fieldset
                  legend={
                    <div className="flex items-center gap-5">
                      <h1 className="text-lg font-medium">
                        Medicine{index + 1}
                      </h1>
                      <ActionIcon
                        onClick={() => removeMedicine(index)}
                        variant="filled"
                        color="red"
                        size="md"
                        radius="md"
                        className="mb-2"
                      >
                        <IconTrash />
                      </ActionIcon>
                    </div>
                  }
                  className="grid gap-4 col-span-2 sm:grid-cols-2"
                >
                  <Select
                    renderOption={renderSelectOption}
                    {...form.getInputProps(
                      `prescription.medicines.${index}.medicineId`,
                    )}
                    withAsterisk
                    label="Medicine"
                    placeholder="Select medicine"
                    onChange={(value: any) => handleChangeMed(value, index)}
                    data={[
                      ...medicine
                        .filter(
                          (x) =>
                            !form.values.prescription.medicines.some(
                              (item1: any, idx) =>
                                item1.medicineId == x.id && idx != index,
                            ),
                        )
                        .map((item) => ({
                          ...item,
                          value: "" + item.id,
                          label: item.name,
                        })),
                      { label: "Other", value: "OTHER" },
                    ]}
                  />
                  {med.medicineId == "OTHER" && (
                    <TextInput
                      {...form.getInputProps(
                        `prescription.medicines.${index}.name`,
                      )}
                      withAsterisk
                      label="Medicine"
                      placeholder="Enter Medicine Name"
                    />
                  )}

                  <TextInput
                    disabled={med.medicineId !== "OTHER"}
                    {...form.getInputProps(
                      `prescription.medicines.${index}.dosage`,
                    )}
                    withAsterisk
                    label="Dosage"
                    placeholder="Enter dosage"
                  />

                  <Select
                    {...form.getInputProps(
                      `prescription.medicines.${index}.frequency`,
                    )}
                    withAsterisk
                    label="Frequency"
                    placeholder="Select frequency"
                    data={dosageFrequencies}
                  />

                  <NumberInput
                    {...form.getInputProps(
                      `prescription.medicines.${index}.duration`,
                    )}
                    withAsterisk
                    label="Duration (in days)"
                    placeholder="Enter duration in days"
                  />

                  {/* <Select
                    {...form.getInputProps(
                      `prescription.medicines.${index}.route`
                    )}
                    withAsterisk
                    label="Route"
                    placeholder="Select route"
                    data={[
                      "Oral",
                      "Injection",
                      "Topical",
                      "Inhalation",
                      "Other",
                    ]}
                  /> */}

                  <Select
                    disabled={med.medicineId !== "OTHER"}
                    {...form.getInputProps(
                      `prescription.medicines.${index}.type`,
                    )}
                    withAsterisk
                    label="Types"
                    placeholder="Select types"
                    data={medicineTypes}
                  />

                  <TextInput
                    {...form.getInputProps(
                      `prescription.medicines.${index}.instruction`,
                    )}
                    withAsterisk
                    label="Instruction"
                    placeholder="Enter instruction"
                  />
                </Fieldset>
              ),
            )}
            <div className="flex items-start col-span-2 justify-center">
              <Button
                onClick={insertMedicine}
                variant="outline"
                color="blue"
                className="col-span-2"
              >
                Add Medicine
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
              Submit Report
            </Button>
            <Button
              loading={loading}
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

export default ApReport;
