
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Student, Teacher, Class, Announcement, AttendanceRecord, Graduate, TanzimRecord, MadrasaFeeRecord } from '../types';
import { STUDENTS, TEACHERS, CLASSES, GRADUATES, TANZIM_RECORDS, MADRASA_FEE_RECORDS } from '../data/mockData';

interface AppContextType {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  classes: Class[];
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
  attendance: AttendanceRecord[];
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  graduates: Graduate[];
  setGraduates: React.Dispatch<React.SetStateAction<Graduate[]>>;
  tanzimRecords: TanzimRecord[];
  setTanzimRecords: React.Dispatch<React.SetStateAction<TanzimRecord[]>>;
  madrasaFeeRecords: MadrasaFeeRecord[];
  setMadrasaFeeRecords: React.Dispatch<React.SetStateAction<MadrasaFeeRecord[]>>;
  isOnline: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useLocalStorage<Student[]>('students', []);
  const [teachers, setTeachers] = useLocalStorage<Teacher[]>('teachers', []);
  const [classes] = useLocalStorage<Class[]>('classes', CLASSES);
  const [announcements, setAnnouncements] = useLocalStorage<Announcement[]>('announcements', []);
  const [attendance, setAttendance] = useLocalStorage<AttendanceRecord[]>('attendance', []);
  const [graduates, setGraduates] = useLocalStorage<Graduate[]>('graduates', []);
  const [tanzimRecords, setTanzimRecords] = useLocalStorage<TanzimRecord[]>('tanzimRecords', []);
  const [madrasaFeeRecords, setMadrasaFeeRecords] = useLocalStorage<MadrasaFeeRecord[]>('madrasaFeeRecords', []);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Populate with mock data if local storage is empty
    if (students.length === 0) setStudents(STUDENTS);
    if (teachers.length === 0) setTeachers(TEACHERS);
    if (graduates.length === 0) setGraduates(GRADUATES);
    if (tanzimRecords.length === 0) setTanzimRecords(TANZIM_RECORDS);
    if (madrasaFeeRecords.length === 0) setMadrasaFeeRecords(MADRASA_FEE_RECORDS);
    if (announcements.length === 0) {
      setAnnouncements([
        { id: 'anno1', title: 'Welcome to Noor ul Masajid', content: 'Classes will commence from the 1st of next month.', date: new Date().toISOString() }
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AppContext.Provider value={{ students, setStudents, teachers, setTeachers, classes, announcements, setAnnouncements, attendance, setAttendance, graduates, setGraduates, tanzimRecords, setTanzimRecords, madrasaFeeRecords, setMadrasaFeeRecords, isOnline }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
