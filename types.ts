
export enum AcademicTrack {
  Hifz = "Hifz",
  DarsENizami = "Dars-e-Nizami",
}

export interface Class {
  id: string;
  name: string;
  track: AcademicTrack;
}

export interface Student {
  id: string;
  name: string;
  picture: string;
  bForm: string;
  fatherName: string;
  fatherCnic: string;
  address: string;
  phone: string;
  classId: string;
}

export enum AttendanceStatus {
  Present = "Present",
  Absent = "Absent",
  Leave = "Leave",
}

export interface AttendanceRecord {
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}

export interface TimeTableEntry {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  subject: string;
  classId: string;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
}

export interface Teacher {
  id: string;
  name: string;
  picture: string;
  contact: string;
  qualifications: string;
  timetable: TimeTableEntry[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string; // ISO 8601 format
}

export enum SanadStatus {
  Received = "Received",
  NotYetIssued = "Not Yet Issued",
  PendingCollection = "Pending Collection",
}

// This will store completion status for Dars-e-Nizami levels
export interface DarsENizamiProgress {
  [classId: string]: boolean; // e.g., { dn1: true, dn2: true, ... }
}

export interface Graduate extends Student {
  graduationDate: string; // YYYY-MM-DD
  degreeCompleted: AcademicTrack;
  alumniPicture?: string;
  // Dars-e-Nizami specific fields
  darsENizamiProgress?: DarsENizamiProgress;
  darsENizamiSanadStatus?: SanadStatus;
  // Hifz specific fields
  hifzSanadStatus?: SanadStatus;
}

export enum FeeStatus {
  Paid = "Paid",
  Pending = "Pending",
}

export interface TanzimRequiredDocuments {
  cnicBForm: boolean;
  passportPhotos: boolean;
  feeReceipt: boolean;
}

export interface TanzimRecord {
  id: string;
  studentId: string;
  examYear: number;
  tanzimClassId: string;
  admissionFee: number;
  feeStatus: FeeStatus;
  feeReceiptNumber: string;
  otherFeeAmount?: number;
  otherFeeStatus?: FeeStatus;
  otherFeeReceiptNumber?: string;
  cnicBFormCopy: string; // base64 data URL
  passportPhoto1: string; // base64 data URL
  passportPhoto2: string; // base64 data URL
  feeReceiptCopy: string; // base64 data URL
  requiredDocuments: TanzimRequiredDocuments;
}

export interface MadrasaFeeRecord {
    id: string;
    studentId: string;
    month: string; // YYYY-MM format
    amount: number;
    status: FeeStatus;
    receiptNumber?: string;
}