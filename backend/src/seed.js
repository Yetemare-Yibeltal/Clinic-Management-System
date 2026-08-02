// seed.js — Populate database with real Kidus Yared Healthcare data
// Run with: npm run seed
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.model.js";
import Department from "./models/Department.model.js";
import Appointment from "./models/Appointment.model.js";
import Schedule from "./models/Schedule.model.js";
import ClinicSettings from "./models/ClinicSettings.model.js";

dotenv.config();

// ── Connect to database ────────────────────────────────
async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected for seeding...");
}

// ── Clear existing data ────────────────────────────────
async function clearData() {
  await Promise.all([
    User.deleteMany({}),
    Department.deleteMany({}),
    Appointment.deleteMany({}),
    Schedule.deleteMany({}),
    ClinicSettings.deleteMany({}),
  ]);
  console.log("Existing data cleared...");
}

// ── Seed departments ───────────────────────────────────
async function seedDepartments() {
  const departments = await Department.insertMany([
    {
      name: "Internal Medicine",
      shortCode: "INTMED",
      description: "General internal medicine and primary care",
      floor: "1st Floor",
      room: "Room 101",
      phone: "+251911001001",
      services: [
        "General Checkup",
        "Chronic Disease Management",
        "Preventive Care",
      ],
      isActive: true,
    },
    {
      name: "Cardiology",
      shortCode: "CARD",
      description: "Heart and cardiovascular system treatment",
      floor: "2nd Floor",
      room: "Room 201",
      phone: "+251911001002",
      services: ["ECG", "Echocardiography", "Heart Disease Management"],
      isActive: true,
    },
    {
      name: "Pediatrics",
      shortCode: "PED",
      description: "Medical care for infants, children and adolescents",
      floor: "1st Floor",
      room: "Room 105",
      phone: "+251911001003",
      services: ["Child Checkup", "Vaccination", "Growth Monitoring"],
      isActive: true,
    },
    {
      name: "Obstetrics & Gynecology",
      shortCode: "OBGYN",
      description: "Women's reproductive health and maternity care",
      floor: "2nd Floor",
      room: "Room 205",
      phone: "+251911001004",
      services: ["Prenatal Care", "Delivery", "Family Planning"],
      isActive: true,
    },
    {
      name: "Dermatology",
      shortCode: "DERM",
      description: "Skin, hair and nail conditions",
      floor: "3rd Floor",
      room: "Room 301",
      phone: "+251911001005",
      services: ["Skin Consultation", "Acne Treatment", "Allergy Testing"],
      isActive: true,
    },
    {
      name: "Orthopedics",
      shortCode: "ORTH",
      description: "Bone, joint and muscle conditions",
      floor: "3rd Floor",
      room: "Room 305",
      phone: "+251911001006",
      services: ["Fracture Treatment", "Joint Pain", "Sports Injuries"],
      isActive: true,
    },
    {
      name: "Ophthalmology",
      shortCode: "OPH",
      description: "Eye care and vision treatment",
      floor: "2nd Floor",
      room: "Room 210",
      phone: "+251911001007",
      services: ["Eye Examination", "Vision Testing", "Cataract Treatment"],
      isActive: true,
    },
    {
      name: "Neurology",
      shortCode: "NEURO",
      description: "Brain and nervous system conditions",
      floor: "4th Floor",
      room: "Room 401",
      phone: "+251911001008",
      services: ["Headache Treatment", "Epilepsy Management", "Stroke Care"],
      isActive: true,
    },
  ]);

  console.log(`${departments.length} departments seeded`);
  return departments;
}

// ── Seed admin ─────────────────────────────────────────
async function seedAdmin() {
  const admin = await User.create({
    firstName: "Kidus",
    lastName: "Yared",
    email: "admin@kidusyared.et",
    phone: "+251911000001",
    password: "Admin@2025",
    role: "admin",
    city: "Addis Ababa",
    region: "Addis Ababa",
    subCity: "Bole",
    woreda: "Woreda 03",
    isActive: true,
    isVerified: true,
  });

  console.log("Admin seeded:", admin.email);
  return admin;
}

// ── Seed doctors ───────────────────────────────────────
async function seedDoctors(departments) {
  const deptMap = {};
  departments.forEach((d) => {
    deptMap[d.shortCode] = d._id;
  });

  const doctorsData = [
    {
      firstName: "Abebe",
      lastName: "Bekele",
      email: "abebe.bekele@kidusyared.et",
      phone: "+251911100001",
      password: "Doctor@2025",
      role: "doctor",
      specialization: "Internal Medicine",
      licenseNumber: "ETH-MED-10001",
      experienceYears: 12,
      consultationFee: 500,
      bio: "Dr. Abebe Bekele is a highly experienced Internal Medicine specialist with over 12 years of practice in Addis Ababa. He focuses on preventive care and chronic disease management.",
      available: true,
      city: "Addis Ababa",
      region: "Addis Ababa",
      subCity: "Kirkos",
      department: deptMap["INTMED"],
    },
    {
      firstName: "Tigist",
      lastName: "Haile",
      email: "tigist.haile@kidusyared.et",
      phone: "+251911100002",
      password: "Doctor@2025",
      role: "doctor",
      specialization: "Cardiology",
      licenseNumber: "ETH-MED-10002",
      experienceYears: 15,
      consultationFee: 700,
      bio: "Dr. Tigist Haile is a renowned Cardiologist with 15 years of experience. She specializes in heart disease management and cardiovascular health.",
      available: true,
      city: "Addis Ababa",
      region: "Addis Ababa",
      subCity: "Bole",
      department: deptMap["CARD"],
    },
    {
      firstName: "Dawit",
      lastName: "Mengistu",
      email: "dawit.mengistu@kidusyared.et",
      phone: "+251911100003",
      password: "Doctor@2025",
      role: "doctor",
      specialization: "Pediatrics",
      licenseNumber: "ETH-MED-10003",
      experienceYears: 8,
      consultationFee: 450,
      bio: "Dr. Dawit Mengistu is a dedicated Pediatrician with 8 years of experience caring for children from newborns to adolescents in Addis Ababa.",
      available: true,
      city: "Addis Ababa",
      region: "Addis Ababa",
      subCity: "Yeka",
      department: deptMap["PED"],
    },
    {
      firstName: "Hiwot",
      lastName: "Tadesse",
      email: "hiwot.tadesse@kidusyared.et",
      phone: "+251911100004",
      password: "Doctor@2025",
      role: "doctor",
      specialization: "Obstetrics & Gynecology",
      licenseNumber: "ETH-MED-10004",
      experienceYears: 10,
      consultationFee: 600,
      bio: "Dr. Hiwot Tadesse is an experienced OB/GYN specialist dedicated to women's health, prenatal care, and safe delivery in Addis Ababa.",
      available: true,
      city: "Addis Ababa",
      region: "Addis Ababa",
      subCity: "Nifas Silk-Lafto",
      department: deptMap["OBGYN"],
    },
    {
      firstName: "Samuel",
      lastName: "Girma",
      email: "samuel.girma@kidusyared.et",
      phone: "+251911100005",
      password: "Doctor@2025",
      role: "doctor",
      specialization: "Dermatology",
      licenseNumber: "ETH-MED-10005",
      experienceYears: 7,
      consultationFee: 500,
      bio: "Dr. Samuel Girma is a skilled Dermatologist specializing in skin conditions, acne treatment, and allergic reactions with 7 years of clinical experience.",
      available: true,
      city: "Addis Ababa",
      region: "Addis Ababa",
      subCity: "Lideta",
      department: deptMap["DERM"],
    },
    {
      firstName: "Meron",
      lastName: "Alemu",
      email: "meron.alemu@kidusyared.et",
      phone: "+251911100006",
      password: "Doctor@2025",
      role: "doctor",
      specialization: "Orthopedics",
      licenseNumber: "ETH-MED-10006",
      experienceYears: 11,
      consultationFee: 650,
      bio: "Dr. Meron Alemu is an Orthopedic specialist with 11 years of experience treating bone fractures, joint conditions, and sports injuries.",
      available: true,
      city: "Addis Ababa",
      region: "Addis Ababa",
      subCity: "Kolfe Keranio",
      department: deptMap["ORTH"],
    },
    {
      firstName: "Yohannes",
      lastName: "Tesfaye",
      email: "yohannes.tesfaye@kidusyared.et",
      phone: "+251911100007",
      password: "Doctor@2025",
      role: "doctor",
      specialization: "Ophthalmology",
      licenseNumber: "ETH-MED-10007",
      experienceYears: 9,
      consultationFee: 550,
      bio: "Dr. Yohannes Tesfaye is an experienced eye specialist providing comprehensive eye care, vision correction, and treatment of eye diseases.",
      available: true,
      city: "Addis Ababa",
      region: "Addis Ababa",
      subCity: "Arada",
      department: deptMap["OPH"],
    },
    {
      firstName: "Selamawit",
      lastName: "Worku",
      email: "selamawit.worku@kidusyared.et",
      phone: "+251911100008",
      password: "Doctor@2025",
      role: "doctor",
      specialization: "Neurology",
      licenseNumber: "ETH-MED-10008",
      experienceYears: 13,
      consultationFee: 750,
      bio: "Dr. Selamawit Worku is a highly experienced Neurologist specializing in brain disorders, epilepsy management, and stroke rehabilitation.",
      available: true,
      city: "Addis Ababa",
      region: "Addis Ababa",
      subCity: "Gulele",
      department: deptMap["NEURO"],
    },
  ];

  const doctors = await User.insertMany(doctorsData);
  console.log(`${doctors.length} doctors seeded`);
  return doctors;
}

// ── Seed doctor schedules ──────────────────────────────
async function seedSchedules(doctors) {
  const schedules = [];

  for (const doctor of doctors) {
    // Mon-Fri available (day 1-5), Sat morning only (day 6)
    // Slots 0-4 = 8AM-12PM, slot 5 = break, slots 6-9 = 1PM-5PM
    const weeklyGrid = {
      1: {
        0: "avail",
        1: "avail",
        2: "avail",
        3: "avail",
        4: "avail",
        5: "break",
        6: "avail",
        7: "avail",
        8: "avail",
        9: "avail",
      },
      2: {
        0: "avail",
        1: "avail",
        2: "avail",
        3: "avail",
        4: "avail",
        5: "break",
        6: "avail",
        7: "avail",
        8: "avail",
        9: "avail",
      },
      3: {
        0: "avail",
        1: "avail",
        2: "avail",
        3: "avail",
        4: "avail",
        5: "break",
        6: "avail",
        7: "avail",
        8: "avail",
        9: "avail",
      },
      4: {
        0: "avail",
        1: "avail",
        2: "avail",
        3: "avail",
        4: "avail",
        5: "break",
        6: "avail",
        7: "avail",
        8: "avail",
        9: "avail",
      },
      5: {
        0: "avail",
        1: "avail",
        2: "avail",
        3: "avail",
        4: "avail",
        5: "break",
        6: "avail",
        7: "avail",
        8: "avail",
        9: "avail",
      },
      6: { 0: "avail", 1: "avail", 2: "avail", 3: "avail" },
      0: {},
    };

    schedules.push({ doctor: doctor._id, weeklyGrid });
  }

  await Schedule.insertMany(schedules);
  console.log(`${schedules.length} doctor schedules seeded`);
}

// ── Seed patients ──────────────────────────────────────
async function seedPatients() {
  const patientsData = [
    {
      firstName: "Selam",
      lastName: "Tesfaye",
      email: "selam.tesfaye@gmail.com",
      phone: "+251911200001",
      password: "Patient@2025",
      role: "patient",
      city: "Addis Ababa",
      region: "Addis Ababa",
      subCity: "Bole",
      woreda: "Woreda 05",
      gender: "female",
      bloodType: "A+",
      dateOfBirth: new Date("1995-03-15"),
      emergencyContact: {
        name: "Tesfaye Alemu",
        phone: "+251911200100",
        relationship: "Father",
      },
    },
    {
      firstName: "Biruk",
      lastName: "Hailu",
      email: "biruk.hailu@gmail.com",
      phone: "+251911200002",
      password: "Patient@2025",
      role: "patient",
      city: "Addis Ababa",
      region: "Addis Ababa",
      subCity: "Kirkos",
      woreda: "Woreda 08",
      gender: "male",
      bloodType: "O+",
      dateOfBirth: new Date("1988-07-22"),
      emergencyContact: {
        name: "Hailu Bekele",
        phone: "+251911200101",
        relationship: "Father",
      },
    },
    {
      firstName: "Mekdes",
      lastName: "Alemu",
      email: "mekdes.alemu@gmail.com",
      phone: "+251911200003",
      password: "Patient@2025",
      role: "patient",
      city: "Addis Ababa",
      region: "Addis Ababa",
      subCity: "Yeka",
      woreda: "Woreda 12",
      gender: "female",
      bloodType: "B+",
      dateOfBirth: new Date("2000-11-08"),
      emergencyContact: {
        name: "Alemu Girma",
        phone: "+251911200102",
        relationship: "Father",
      },
    },
    {
      firstName: "Yared",
      lastName: "Mengistu",
      email: "yared.mengistu@gmail.com",
      phone: "+251911200004",
      password: "Patient@2025",
      role: "patient",
      city: "Addis Ababa",
      region: "Addis Ababa",
      subCity: "Arada",
      woreda: "Woreda 02",
      gender: "male",
      bloodType: "AB+",
      dateOfBirth: new Date("1992-05-30"),
      emergencyContact: {
        name: "Mengistu Tadesse",
        phone: "+251911200103",
        relationship: "Father",
      },
    },
    {
      firstName: "Hana",
      lastName: "Bekele",
      email: "hana.bekele@gmail.com",
      phone: "+251911200005",
      password: "Patient@2025",
      role: "patient",
      city: "Addis Ababa",
      region: "Addis Ababa",
      subCity: "Lideta",
      woreda: "Woreda 07",
      gender: "female",
      bloodType: "O-",
      dateOfBirth: new Date("1998-09-14"),
      emergencyContact: {
        name: "Bekele Worku",
        phone: "+251911200104",
        relationship: "Father",
      },
    },
  ];

  const patients = await User.insertMany(patientsData);
  console.log(`${patients.length} patients seeded`);
  return patients;
}

// ── Seed clinic settings ───────────────────────────────
async function seedClinicSettings() {
  await ClinicSettings.create({
    clinicName: "Kidus Yared Healthcare",
    tagline: "Your Health, Our Priority",
    email: "info@kidusyared.et",
    phone: "+251911000001",
    alternatePhone: "+251922000002",
    website: "https://kidusyared.et",
    address: {
      street: "Bole Road",
      subCity: "Bole",
      woreda: "Woreda 03",
      city: "Addis Ababa",
      region: "Addis Ababa",
      country: "Ethiopia",
      landmark: "Near Bole International Airport",
    },
    paymentSettings: {
      currency: "ETB",
      acceptCash: true,
      acceptTeleBirr: true,
      acceptCBEBirr: true,
      acceptAwashBirr: true,
      acceptHelloCash: true,
      acceptMobileBanking: true,
      acceptBankTransfer: true,
      acceptChapa: true,
      teleBirrAccount: "0911000001",
      cbeBirrAccount: "1000000000001",
      awashBirrAccount: "0100000000001",
      helloCashAccount: "0911000001",
      bankName: "Commercial Bank of Ethiopia",
      bankAccountNumber: "1000000000001",
      bankAccountName: "Kidus Yared Healthcare",
    },
    appointmentSettings: {
      defaultConsultationFee: 500,
      maxAppointmentsPerDay: 50,
      appointmentDuration: 30,
      advanceBookingDays: 30,
      cancellationHours: 24,
      reminderHoursBefore: 24,
      allowVideoConsultation: true,
    },
    socialMedia: {
      facebook: "https://facebook.com/kidusyaredhealthcare",
      telegram: "https://t.me/kidusyaredhealthcare",
      instagram: "https://instagram.com/kidusyaredhealthcare",
    },
  });

  console.log("Clinic settings seeded");
}

// ── Seed sample appointments ───────────────────────────
async function seedAppointments(patients, doctors) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const toStr = (d) => d.toISOString().split("T")[0];

  const appointmentsData = [
    {
      patient: patients[0]._id,
      doctor: doctors[0]._id,
      date: toStr(tomorrow),
      time: "9:00 AM",
      type: "consultation",
      visitMode: "in-person",
      symptoms: "Persistent headache and fatigue for 2 weeks",
      fee: doctors[0].consultationFee,
      status: "confirmed",
      isPaid: false,
      paymentMethod: null,
    },
    {
      patient: patients[1]._id,
      doctor: doctors[1]._id,
      date: toStr(tomorrow),
      time: "10:00 AM",
      type: "check-up",
      visitMode: "in-person",
      symptoms: "Routine cardiac checkup",
      fee: doctors[1].consultationFee,
      status: "confirmed",
      isPaid: true,
      paymentMethod: "cash",
    },
    {
      patient: patients[2]._id,
      doctor: doctors[2]._id,
      date: toStr(nextWeek),
      time: "11:00 AM",
      type: "consultation",
      visitMode: "in-person",
      symptoms: "Child has fever and cough for 3 days",
      fee: doctors[2].consultationFee,
      status: "pending",
      isPaid: false,
      paymentMethod: null,
    },
    {
      patient: patients[3]._id,
      doctor: doctors[3]._id,
      date: toStr(nextWeek),
      time: "2:00 PM",
      type: "follow-up",
      visitMode: "in-person",
      symptoms: "Follow up after previous consultation",
      fee: doctors[3].consultationFee,
      status: "pending",
      isPaid: false,
      paymentMethod: null,
    },
    {
      patient: patients[4]._id,
      doctor: doctors[4]._id,
      date: toStr(today),
      time: "3:00 PM",
      type: "consultation",
      visitMode: "in-person",
      symptoms: "Skin rash and itching",
      fee: doctors[4].consultationFee,
      status: "completed",
      isPaid: true,
      paymentMethod: "telebirr",
    },
  ];

  const appointments = await Appointment.insertMany(appointmentsData);
  console.log(`${appointments.length} sample appointments seeded`);
}

// ── Main seed function ─────────────────────────────────
async function seed() {
  try {
    await connectDB();
    await clearData();

    const departments = await seedDepartments();
    const admin = await seedAdmin();
    const doctors = await seedDoctors(departments);
    await seedSchedules(doctors);
    const patients = await seedPatients();
    await seedClinicSettings();
    await seedAppointments(patients, doctors);

    console.log("\n✅ Seed completed successfully!");
    console.log("\n── Login Credentials ──────────────────");
    console.log("Admin:    admin@kidusyared.et     / Admin@2025");
    console.log("Doctor:   abebe.bekele@kidusyared.et / Doctor@2025");
    console.log("Patient:  selam.tesfaye@gmail.com / Patient@2025");
    console.log("─────────────────────────────────────\n");

    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();
