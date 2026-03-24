import { DonutChartCell } from "@mantine/charts";
import { time } from "console";
import { bloodGroup } from "./DropdownData";

const data = [
  { date: "Jan 2025", appointments: 54 },
  { date: "Feb 2025", appointments: 88 },
  { date: "Mar 2025", appointments: 41 },
  { date: "Apr 2025", appointments: 97 },
  { date: "May 2025", appointments: 76 },
  { date: "Jun 2025", appointments: 32 },
  { date: "Jul 2025", appointments: 115 },
  { date: "Aug 2025", appointments: 68 },
  { date: "Sep 2025", appointments: 82 },
  { date: "Oct 2025", appointments: 59 },
  { date: "Nov 2025", appointments: 103 },
  { date: "Dec 2025", appointments: 47 },
];

const patientData = [
  { date: "Jan 2025", patients: 34 },
  { date: "Feb 2025", patients: 78 },
  { date: "Mar 2025", patients: 51 },
  { date: "Apr 2025", patients: 67 },
  { date: "May 2025", patients: 86 },
  { date: "Jun 2025", patients: 42 },
  { date: "Jul 2025", patients: 95 },
  { date: "Aug 2025", patients: 58 },
  { date: "Sep 2025", patients: 72 },
  { date: "Oct 2025", patients: 49 },
  { date: "Nov 2025", patients: 83 },
  { date: "Dec 2025", patients: 67 },
];

const doctorData = [
  { date: "Jan 2025", doctors: 14 },
  { date: "Feb 2025", doctors: 28 },
  { date: "Mar 2025", doctors: 21 },
  { date: "Apr 2025", doctors: 37 },
  { date: "May 2025", doctors: 46 },
  { date: "Jun 2025", doctors: 32 },
  { date: "Jul 2025", doctors: 55 },
  { date: "Aug 2025", doctors: 38 },
  { date: "Sep 2025", doctors: 42 },
  { date: "Oct 2025", doctors: 29 },
  { date: "Nov 2025", doctors: 63 },
  { date: "Dec 2025", doctors: 37 },
];

const diseaseData: DonutChartCell[] = [
  { name: "Fever", value: 40, color: "#FF6B6B" },
  { name: "Cold", value: 60, color: "#4DABF7" },
  { name: "Diabetes", value: 30, color: "#51CF66" },
  { name: "Hypertension", value: 50, color: "#FCC419" },
  { name: "Asthma", value: 20, color: "#845EF7" },
]; 

const patients = [
  {
    name: "Alice Williams",
    email: "alice.williams@example.com",
    location: "New York",
    bloodGroup: "A+",
  },
  {
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    location: "Los Angeles",
    bloodGroup: "B-",
  },
  {
    name: "Charlie Davis",
    email: "charlie.davis@example.com",
    location: "Chicago",
    bloodGroup: "O+",
  },  
  {
    name: "Diana Garcia",
    email: "diana.garcia@example.com",
    location: "Houston",
    bloodGroup: "AB-",
  }
];

const doctors = [
  {
    name: "Dr. John Doe",
    email: "john.doe@example.com",
    location: "New York",
    departement: "Cardiology",
  },
  {
    name: "Dr. Jane Smith",
    email: "jane.smith@example.com",
    location: "Los Angeles",
    departement: "Neurology",
  },
  {
    name: "Dr. Emily Johnson",
    email: "emily.johnson@example.com",
    location: "Chicago",
    departement: "Pediatrics",
  },
  {
    name: "Dr. Michael Brown",
    email: "michael.brown@example.com",
    location: "Houston",
    departement: "Orthopedics",
  },
];

const appointments = [
    {
        time: "09:00 AM",
        patient: "Alice Williams",
        reason: "General Checkup",
        doctor: "Dr. John Doe"
    },
    {
        time: "10:30 AM",
        patient: "Bob Johnson",
        reason: "Follow-up Visit",
        doctor: "Dr. Jane Smith"
    },
    {
        time: "12:00 PM",
        patient: "Charlie Davis",
        reason: "Consultation",
        doctor: "Dr. Emily Johnson"
    },
    {
        time: "02:00 PM",
        patient: "Diana Garcia",
        reason: "Prescription Refill",
        doctor: "Dr. Michael Brown"
    }
];

const medicines = [
    {
        name: "Paracetamol",
        dosage: "500mg",
        stock: 120,
        manufacturer: "Pharma Inc."
    },
    {
        name: "Amoxicillin",
        dosage: "250mg",
        stock: 80,
        manufacturer: "HealthCorp"
    },
    {   
        name: "Ibuprofen",
        dosage: "200mg",
        stock: 150,
        manufacturer: "MediHealth"
    },
    {
        name: "Cetirizine",
        dosage: "10mg",
        stock: 60,
        manufacturer: "Wellness Labs"
    }

];

export { data, patientData, doctorData, diseaseData, patients, doctors, appointments, medicines };