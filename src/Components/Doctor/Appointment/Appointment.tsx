import React, { useState, useEffect } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import {
  IconEdit,
  IconEye,
  IconLayoutGrid,
  IconPlus,
  IconSearch,
  IconTable,
  IconTrash,
} from "@tabler/icons-react";
import {
  TextInput,
  Button,
  ActionIcon,
  Modal,
  Select,
  Textarea,
  LoadingOverlay,
  Text,
  SegmentedControl,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { getDoctorDropdown } from "../../../Service/DoctorProfileService";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { appointmentReasons } from "../../../Data/DropdownData";
import { useSelector } from "react-redux";
import {
  cancelAppointment,
  getAppointmentsByDoctor,
  getAppointmentsByPatient,
  scheduleAppointment,
} from "../../../Service/AppointmentService";
import {
  errorNotification,
  successNotification,
} from "../../../Utility/NotificationUtil";
import { formatDateWithTime, formateDate } from "../../../Utility/DateUtility";
import { modals } from "@mantine/modals";
import "primereact/resources/themes/lara-light-blue/theme.css";
import { Toolbar } from "primereact/toolbar";
import { useNavigate } from "react-router-dom";
import ApCard from "./ApCard";

interface Customer {
  id: number;
  name: string;
  country: { name: string; code: string };
  company: string;
  date: string | Date;
  status: string;
  verified: boolean;
  activity: number;
  representative: { name: string; image: string };
  balance: number;
}

const Appointment = () => {
  const matches = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const [view , setView] = useState("table");
  const [opened, { open, close }] = useDisclosure(false);
  const user = useSelector((state: any) => state.user);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tab, setTab] = useState<string>("Today");

  const [appointments, setAppointments] = useState<any[]>([]);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    patientName: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    reason: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

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

  const fetchAppointments = () => {
    getAppointmentsByPatient(user.profileId)
      .then((data) => {
        setAppointments(data);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
      });
  };

  useEffect(() => {
    fetchData();
    getDoctorDropdown()
      .then((data) => {
        console.log(data);
        setDoctors(
          data.map((doctor: any) => ({
            label: doctor.name,
            value: "" + doctor.id,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching doctors:", error);
      });
  }, []);

  const fetchData = () => {
    getAppointmentsByDoctor(user.profileId)
      .then((data) => {
        setAppointments(data);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
      });
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters: any = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const form = useForm({
    initialValues: {
      doctorId: "",
      patientId: user.profileId,
      appointmentTime: new Date(),
      reason: "",
      notes: "",
    },
    validate: {
      doctorId: (value: any) => (value ? null : "Doctor is required"),
      appointmentTime: (value: any) =>
        value ? null : "Appointment time is required",
      reason: (value: any) => (value ? null : "Reason is required"),
    },
  });

  const renderHeader = () => {
    return (
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <Button leftSection={<IconPlus />} onClick={open} variant="filled">
          Schedule Appointment
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

  const statusBodyTemplate = (rowData: any) => {
    return (
      <Tag value={rowData.status} severity={getSeverity(rowData.status)} />
    );
  };

  const handleDelete = (rowData: any) => {
    modals.openConfirmModal({
      title: (
        <span className="text-xl font-serif font-semibold">
          {" "}
          Confirm Deletion{" "}
        </span>
      ),
      centered: true,
      children: (
        <Text size="sm">Are you sure you want to delete the appointment?</Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },

      onConfirm: () => {
        cancelAppointment(rowData.id)
          .then(() => {
            successNotification("Appointment Cancelled Successfully");
            setAppointments(
              appointments.map((appointment) =>
                appointment.id === rowData.id
                  ? { ...appointment, status: "CANCELLED" }
                  : appointment
              )
            );
          })
          .catch((error) => {
            errorNotification(
              error.response?.data?.errorMessage ||
                "Failed to cancel appointment"
            );
          });
      },
    });
  };

  const handleEdit = (rowData: any) => {};

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2 ">
        <ActionIcon onClick={() => navigate("" + rowData.id)}>
          <IconEye size={20} stroke={1.5} />
        </ActionIcon>

        <ActionIcon
          variant="filled"
          color="red"
          onClick={() => handleDelete(rowData)}
        >
          <IconTrash size={20} stroke={1.5} />
        </ActionIcon>
      </div>
    );
  };

  const handleSubmit = (values: any) => {
    const payload = {
      doctorId: parseInt(values.doctorId),
      patientId: values.patientId,
      appointmentTime:
        values.appointmentTime instanceof Date
          ? values.appointmentTime.toISOString()
          : new Date(values.appointmentTime).toISOString(),
      reason: values.reason,
      notes: values.notes || "",
    };

    console.log("Sending payload:", payload);
    console.log("User profileId:", user.profileId);
    console.log(
      "appointmentTime type:",
      typeof values.appointmentTime,
      values.appointmentTime
    );

    setLoading(true);
    scheduleAppointment(payload)
      .then((data) => {
        close();
        form.reset();
        successNotification("Appointment Scheduled Successfully");
        fetchAppointments();
      })
      .catch((error) => {
        console.error("Full error:", error);
        console.error("Response data:", error.response?.data);
        errorNotification(
          error.response?.data?.errorMessage || "Failed to schedule appointment"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const timeTemplate = (rowData: any) => {
    return <span>{formatDateWithTime(rowData.appointmentTime)}</span>;
  };

  const leftToolbarTemplate = () => {
    return (
      <Button leftSection={<IconPlus />} size={matches ? "xs":"md"} onClick={open} variant="filled">
        Schedule
      </Button>
    );
  };

  const centerToolbarTemplate = () => {
    return (
      <SegmentedControl
        value={tab}
        size={matches ? "xs" : "md"}
        variant="filled"
        color={tab === "Past" ? "red" : tab === "Today" ? "primary" : "blue"}
        onChange={setTab}
        data={["Past", "Today", "Upcoming"]}
      />
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <div className="md:flex hidden gap-5 items-center">
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
          leftSection={<IconSearch />}
          fw={500}
          className="lg:block hidden"
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
        />
      </div>
    );
  };

  const filterAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.appointmentTime);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointmentDay = new Date(appointmentDate);
    appointmentDay.setHours(0, 0, 0, 0);

    if (tab === "Today") {
      return appointmentDay.getTime() === today.getTime();
    } else if (tab === "Past") {
      return appointmentDay.getTime() < today.getTime();
    } else if (tab === "Upcoming") {
      return appointmentDay.getTime() > today.getTime();
    }
    return true;
  });

  return (
    <div className="card">
      <Toolbar
        className="mb-4 md:p-3 p-1"
        start={centerToolbarTemplate}
        end={rightToolbarTemplate}
      ></Toolbar>
      {view === "table" && !matches ? (
        <DataTable
          stripedRows
          value={filterAppointments}
          size="small"
          paginator
          rows={10}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          rowsPerPageOptions={[10, 25, 50]}
          dataKey="id"
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={["patientName", "reason", "notes", "status"]}
          emptyMessage="No appointments found."
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        >
          <Column
            field="patientName"
            header="Patient"
            sortable
            filter
            filterPlaceholder="Search by name"
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="appointmentTime"
            header="Appointment Time"
            sortable
            filterPlaceholder="Search by date"
            style={{ minWidth: "14rem" }}
            body={timeTemplate}
          />
          <Column
            field="reason"
            header="Reason"
            sortable
            filter
            filterMenuStyle={{ width: "14rem" }}
            filterPlaceholder="Search by Reason"
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="notes"
            header="Notes"
            sortable
            filter
            filterPlaceholder="Search by Notes"
            style={{ minWidth: "14rem" }}
          />
          <Column field="patientPhone" header="Patient Phone" />
          <Column
            field="status"
            header="Status"
            sortable
            filterMenuStyle={{ width: "14rem" }}
            style={{ minWidth: "12rem" }}
            body={statusBodyTemplate}
            filter
          />

          <Column
            headerStyle={{ width: "5rem", textAlign: "center" }}
            bodyStyle={{ textAlign: "center", overflow: "visible" }}
            body={actionBodyTemplate}
          />
        </DataTable>
      ) : (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
          {filterAppointments?.map((appointment) => (
            <ApCard key={appointment.id} {...appointment} />
          ))}
          {filterAppointments.length === 0 && (
            <div className="col-span-4 text-center text-gray-500">
              No appointments found.
            </div>
          )}
        </div>
      )}
      <Modal
        opened={opened}
        size="lg"
        onClose={close}
        title={
          <div className="text-xl font-semibold text-primary-500">
            Schedule Appointment
          </div>
        }
        centered
      >
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className="grid grid-cols-1 gap-5"
        >
          <Select
            {...form.getInputProps("doctorId")}
            withAsterisk
            data={doctors}
            label="Doctor"
            placeholder="Select Doctor"
          />
          <DateTimePicker
            minDate={new Date()}
            {...form.getInputProps("appointmentTime")}
            withAsterisk
            label="Appointment Date & Time"
            placeholder="Select date and time"
            timePickerProps={{
              format: "12h",
            }}
          />
          <Select
            {...form.getInputProps("reason")}
            data={appointmentReasons}
            withAsterisk
            label="Reason for Appointment"
            placeholder="Enter reason"
          />
          <Textarea
            {...form.getInputProps("notes")}
            label="Additional Notes"
            placeholder="Enter any additional notes"
          />
          <Button type="submit" variant="filled" fullWidth>
            Submit
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Appointment;
