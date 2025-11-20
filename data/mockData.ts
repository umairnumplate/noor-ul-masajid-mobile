
import { Class, AcademicTrack, Student, Teacher, Graduate, SanadStatus, TanzimRecord, FeeStatus, MadrasaFeeRecord } from '../types';

export const CLASSES: Class[] = [
    { id: 'dn1', name: 'Mutawassitah', track: AcademicTrack.DarsENizami },
    { id: 'dn2', name: 'Aammah Awwal', track: AcademicTrack.DarsENizami },
    { id: 'dn3', name: 'Aammah Doum', track: AcademicTrack.DarsENizami },
    { id: 'dn4', name: 'Khaasah Awwal', track: AcademicTrack.DarsENizami },
    { id: 'dn5', name: 'Khaasah Doum', track: AcademicTrack.DarsENizami },
    { id: 'dn6', name: 'Aaliyah Awwal', track: AcademicTrack.DarsENizami },
    { id: 'dn7', name: 'Aaliyah Doum', track: AcademicTrack.DarsENizami },
    { id: 'dn8', name: 'Aalamiyah Awwal', track: AcademicTrack.DarsENizami },
    { id: 'dn9', name: 'Aalamiyah Doum', track: AcademicTrack.DarsENizami },
    { id: 'h1', name: 'Nazira', track: AcademicTrack.Hifz },
    { id: 'h2', name: 'Hifz Ibtidai', track: AcademicTrack.Hifz },
    { id: 'h3', name: 'Hifz Mukammal', track: AcademicTrack.Hifz },
];

export const STUDENTS: Student[] = [
    { id: 's1', name: 'Ahmed Ali', picture: 'https://picsum.photos/seed/s1/200', bForm: '12345-6789012-1', fatherName: 'Muhammad Ali', fatherCnic: '34567-8901234-5', address: '123, Main Street, Lahore', phone: '0300-1234567', classId: 'dn2' },
    { id: 's2', name: 'Fatima Raza', picture: 'https://picsum.photos/seed/s2/200', bForm: '12345-6789012-2', fatherName: 'Ali Raza', fatherCnic: '34567-8901234-6', address: '456, Park Avenue, Karachi', phone: '0321-7654321', classId: 'h1' },
    { id: 's3', name: 'Bilal Khan', picture: 'https://picsum.photos/seed/s3/200', bForm: '12345-6789012-3', fatherName: 'Imran Khan', fatherCnic: '34567-8901234-7', address: '789, Gulberg, Islamabad', phone: '0333-1122334', classId: 'dn2' },
];

export const TEACHERS: Teacher[] = [
    {
        id: 't1',
        name: 'Ustad Tariq Jameel',
        picture: 'https://picsum.photos/seed/t1/200',
        contact: '0301-9876543',
        qualifications: 'PhD in Islamic Studies, Wafaq ul Madaris',
        timetable: [
            { id: 'tt1', day: 'Monday', subject: 'Fiqh', classId: 'dn8', startTime: '09:00', endTime: '10:00' },
            { id: 'tt2', day: 'Monday', subject: 'Hadith', classId: 'dn9', startTime: '10:00', endTime: '11:00' },
            { id: 'tt3', day: 'Tuesday', subject: 'Tafseer', classId: 'dn8', startTime: '09:00', endTime: '10:00' },
        ]
    },
    {
        id: 't2',
        name: 'Qari Ahmed Raza',
        picture: 'https://picsum.photos/seed/t2/200',
        contact: '0345-1237890',
        qualifications: 'Certified Qari, 10 Qiraat',
        timetable: [
            { id: 'tt4', day: 'Monday', subject: 'Tajweed', classId: 'h1', startTime: '08:00', endTime: '10:00' },
            { id: 'tt5', day: 'Tuesday', subject: 'Hifz Review', classId: 'h3', startTime: '11:00', endTime: '13:00' },
        ]
    }
];

export const GRADUATES: Graduate[] = [
    {
        id: 'a1',
        name: 'Zayn Abdullah',
        picture: 'https://picsum.photos/seed/a1/200',
        alumniPicture: 'https://picsum.photos/seed/a1-grad/200',
        bForm: '23456-7890123-1',
        fatherName: 'Abdullah Khan',
        fatherCnic: '45678-9012345-6',
        address: 'House 1, Sector A, Capital City',
        phone: '0311-1122334',
        classId: 'dn9', // Last class attended
        graduationDate: '2023-03-15',
        degreeCompleted: AcademicTrack.DarsENizami,
        darsENizamiProgress: {
            dn1: true, dn2: true, dn3: true, dn4: true, dn5: true, dn6: true, dn7: true, dn8: true, dn9: true,
        },
        darsENizamiSanadStatus: SanadStatus.Received,
    },
    {
        id: 'a2',
        name: 'Aisha Malik',
        picture: 'https://picsum.photos/seed/a2/200',
        bForm: '34567-8901234-2',
        fatherName: 'Tariq Malik',
        fatherCnic: '56789-0123456-7',
        address: 'Apt 5, B Block, Metro City',
        phone: '0322-2233445',
        classId: 'h3', // Last class attended
        graduationDate: '2024-01-20',
        degreeCompleted: AcademicTrack.Hifz,
        hifzSanadStatus: SanadStatus.PendingCollection,
    },
];

export const TANZIM_RECORDS: TanzimRecord[] = [
    {
        id: 'tz1',
        studentId: 's1',
        examYear: 2025,
        tanzimClassId: 'dn2',
        admissionFee: 2500,
        feeStatus: FeeStatus.Paid,
        feeReceiptNumber: 'CH-12345',
        otherFeeAmount: 500,
        otherFeeStatus: FeeStatus.Paid,
        otherFeeReceiptNumber: 'MISC-01',
        cnicBFormCopy: '',
        passportPhoto1: '',
        passportPhoto2: '',
        feeReceiptCopy: '',
        requiredDocuments: {
            cnicBForm: true,
            passportPhotos: true,
            feeReceipt: true,
        },
    },
    {
        id: 'tz2',
        studentId: 's3',
        examYear: 2025,
        tanzimClassId: 'dn2',
        admissionFee: 2500,
        feeStatus: FeeStatus.Pending,
        feeReceiptNumber: '',
        cnicBFormCopy: '',
        passportPhoto1: '',
        passportPhoto2: '',
        feeReceiptCopy: '',
        requiredDocuments: {
            cnicBForm: true,
            passportPhotos: false,
            feeReceipt: false,
        },
    }
];

export const MADRASA_FEE_RECORDS: MadrasaFeeRecord[] = [
    { id: 'mf1', studentId: 's1', month: '2024-09', amount: 1500, status: FeeStatus.Paid, receiptNumber: 'R-09-001' },
    { id: 'mf2', studentId: 's2', month: '2024-09', amount: 1200, status: FeeStatus.Paid, receiptNumber: 'R-09-002' },
    { id: 'mf3', studentId: 's3', month: '2024-09', amount: 1500, status: FeeStatus.Pending },
    { id: 'mf4', studentId: 's1', month: '2024-10', amount: 1500, status: FeeStatus.Pending },
];