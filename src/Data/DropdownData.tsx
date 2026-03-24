const bloodGroups = [
  { value: "A_POSITIVE", label: "A+" },
  { value: "A_NEGATIVE", label: "A-" },
  { value: "B_POSITIVE", label: "B+" },
  { value: "B_NEGATIVE", label: "B-" },
  { value: "AB_POSITIVE", label: "AB+" },
  { value: "AB_NEGATIVE", label: "AB-" },
  { value: "O_POSITIVE", label: "O+" },
  { value: "O_NEGATIVE", label: "O-" },
];

const bloodGroup: Record<string, string> = {
  A_POSITIVE: "A+",
  A_NEGATIVE: "A-",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB-",
  O_POSITIVE: "O+",
  O_NEGATIVE: "O-",
};

const bloodGroupsMap = bloodGroup;

const doctorSpecializations = [
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Pediatrics",
  "Psychiatry",
  "Radiology",
  "Oncology",
  "Gynecology",
  "Orthopedics",
  "Urology",
  "Gastroenterology",
  "Endocrinology",
  "Hematology",
];

const doctorDepartments = [
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Pediatrics",
  "Psychiatry",
  "Radiology",
  "Oncology",
  "Gynecology",
  "Orthopedics",
  "Urology",
  "Gastroenterology",
  "Endocrinology",
  "Hematology",
  "Surgery",
];

const appointmentReasons = [
  "General Checkup",
  "Follow-up Visit",
  "Prescription Refill",
  "Lab Results Review",
  "Chronic Condition Management",
  "New Symptoms Evaluation",
  "Specialist Referral",
  "Pre-surgery Consultation",
  "Post-surgery Follow-up",
  "Diagnostic Testing",
  "Second Opinion",
  "Fever / Cold / Flu Symptoms",
  "Headache or Migraine",
  "Stomach Pain",
  "Back or Joint Pain",
  "Skin Rash / Allergy",
  "High Blood Pressure",
  "Diabetes Consultation",
  "Follow-up Appointment",
  "Lab Test / Blood Work",
  "Vaccination",
  "Mental Health Consultation",
  "Women's Health Check",
  "Men's Health Check",
  "Pediatric Consultation",
  "Injury or Wound Check",
  "Chest Pain / Breathing Issues",
  "Digestive Issues",
  "Other",
];

const symptoms = [
  "Fever",
  "Cough",
  "Headache",
  "Body Ache",
  "Weakness",
  "Dizziness",
  "Sore Throat",
  "Sneezing",
  "Nasal Congestion",
  "Chest Pain",
  "Shortness of Breath",
  "Palpitations",
  "Sweating",
  "Fatigue",
  "Swelling in Legs",
  "Abdominal Pain",
  "Acidity",
  "Nausea",
  "Vomiting",
  "Diarrhea",
  "Constipation",
  "Bloating",
  "Indigestion",
  "Blurred Vision",
  "Numbness",
  "Tingling Sensation",
  "Rash",
  "Irritability",
  "Ear Pain",
  "Loss of Appetite",
  "Increased Thirst",
  "Frequent Urination",
  "Slow Healing Wounds",
  "Back Pain",
  "Joint Pain",
  "Dry Cough",
  "Chills",
  "Weight Loss",
  "Sleep Disturbance",
];

const tests = [
  "Blood Test",
  "CBC",
  "Lipid Profile",
  "Liver Function Test",
  "Kidney Function Test",
  "Thyroid Profile",
  "Fasting Blood Sugar",
  "HbA1c",
  "Urine Routine",
  "Urine Culture",
  "ECG",
  "Chest X-Ray",
  "MRI Brain",
  "CT Scan Abdomen",
  "Ultrasound Abdomen",
  "Dengue NS1",
  "Malaria Test",
  "COVID-19 RTPCR",
  "CRP",
  "ESR",
  "Vitamin D Test",
  "Vitamin B12 Test",
  "Stool Test",
  "Allergy Test",
  "Echocardiogram",
  "Stress Test",
  "Pulmonary Function Test",
  "Endoscopy",
  "Colonoscopy",
  "Hormone Panel",
];

const dosageFrequencies = [
  "1-0-1", // Morning + Night
  "1-1-1", // Morning + Afternoon + Night (Thrice a day)
  "1-0-0", // Morning only
  "0-1-0", // Afternoon only
  "0-0-1", // Night only
  "1-1-0", // Morning + Afternoon
  "0-1-1", // Afternoon + Night
  "0-0-0", // No regular dose (useful for conditional cases)

  "½-0-½", // Half tablet Morning + Night
  "½-½-½", // Half tablet thrice a day
  "½-0-0", // Half tablet Morning only
  "0-½-0", // Half tablet Afternoon only
  "0-0-½", // Half tablet Night only
  "½-½-0", // Half tablet Morning + Afternoon
  "0-½-½", // Half tablet Afternoon + Night

  "1-½-1", // Full–Half–Full dose all day
  "1-½-0", // Morning full + Afternoon half
  "½-1-½", // Half–Full–Half
  "½-0-1", // Half in morning + full at night
  "1-1-½", // Morning full + Afternoon full + Night half
  "0-½-1", // Afternoon half + full at night

  "OD", // Once Daily
  "BD", // Twice Daily (Morning–Night)
  "TDS", // Thrice Daily
  "QID", // Four times a day
  "SOS", // Only when needed (as required)
  "HS", // At bedtime
  "STAT", // Immediately (urgent)
];

const frequencyMap: Record<string, number> = {
  "1-0-0": 1,
  "0-1-0": 1,
  "0-0-1": 1,
  "1-0-1": 2,
  "0-1-1": 2,
  "1-1-0": 2,
  "1-1-1": 3,
  "0-0-0": 0,
  "½-0-0": 0.5,
  "0-½-0": 0.5,
  "0-0-½": 0.5,
  "½-0-½": 1,
  "½-½-0": 1,
  "0-½-½": 1,
  "½-½-½": 1.5,
  "1-½-0": 1.5,
  "½-1-½": 2,
  "½-0-1": 1.5,
  "1-0-0 (SOS)": 0.5,
  "1-0-1 (Alt Days)": 1,
}

const medicineCategories = [
  { label: "Antibiotic", value: "ANTIBIOTIC" },
  { label: "Analgesic", value: "ANALGESIC" },
  { label: "Antiviral", value: "ANTIVIRAL" },
  { label: "Antifungal", value: "ANTIFUNGAL" },
  { label: "Vaccine", value: "VACCINE" },
  { label: "Supplement", value: "SUPPLEMENT" },
  { label: "Antiseptic", value: "ANTISEPTIC" },
  { label: "Sedative", value: "SEDATIVE" },
  { label: "Diuretic", value: "DIURETIC" },
  { label: "Hormone", value: "HORMONE" },
  { label: "Antidepressant", value: "ANTIDEPRESSANT" },
  { label: "Antipsychotic", value: "ANTIPSYCHOTIC" },
  { label: "Antihistamine", value: "ANTIHISTAMINE" },
  { label: "Other", value: "OTHER" },
];


const medicineTypes = [
  { label: "Syrup", value: "SYRUP" },
  { label: "Tablet", value: "TABLET" },
  { label: "Capsule", value: "CAPSULE" },
  { label: "Injection", value: "INJECTION" },
  { label: "Ointment", value: "OINTMENT" },
  { label: "Drops", value: "DROPS" },
  { label: "Inhaler", value: "INHALER" },
  { label: "Patch", value: "PATCH" },
  { label: "Powder", value: "POWDER" },
  { label: "Gel", value: "GEL" },
  { label: "Suppository", value: "SUPPOSITORY" },
  { label: "Lotion", value: "LOTION" },
  { label: "Spray", value: "SPRAY" },
  { label: "Other", value: "OTHER" },
];




export {
  bloodGroups,
  doctorSpecializations,
  doctorDepartments,
  bloodGroup,
  appointmentReasons,
  symptoms,
  tests,
  dosageFrequencies,
  medicineCategories,
  medicineTypes,
  frequencyMap,
  bloodGroupsMap,
};
