import React, { useState, useMemo, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Student, AttendanceRecord, AttendanceStatus, AcademicTrack } from '../types';
import { UserGroupIcon, CheckBadgeIcon, XCircleIcon, ExclamationTriangleIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';

const Attendance: React.FC = () => {
    const { classes, students, attendance, setAttendance } = useAppContext();
    
    const [filter, setFilter] = useState<string>('dars-e-nizami-all'); // classId or track filter
    const [searchTerm, setSearchTerm] = useState('');
    const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [calendarMonth, setCalendarMonth] = useState(new Date());
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const { darsENizamiClasses, hifzClasses } = useMemo(() => ({
        darsENizamiClasses: classes.filter(c => c.track === AcademicTrack.DarsENizami),
        hifzClasses: classes.filter(c => c.track === AcademicTrack.Hifz)
    }), [classes]);

    const studentsToDisplay = useMemo(() => {
        let studentList;
        if (filter === 'dars-e-nizami-all') {
            const classIds = new Set(darsENizamiClasses.map(c => c.id));
            studentList = students.filter(s => classIds.has(s.classId));
        } else if (filter === 'hifz-all') {
            const classIds = new Set(hifzClasses.map(c => c.id));
            studentList = students.filter(s => classIds.has(s.classId));
        } else {
            studentList = students.filter(s => s.classId === filter);
        }

        if (searchTerm.trim()) {
            studentList = studentList.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        return studentList.sort((a,b) => a.name.localeCompare(b.name));
    }, [students, filter, darsENizamiClasses, hifzClasses, searchTerm]);

    const dailyStats = useMemo(() => {
        const studentIds = new Set(studentsToDisplay.map(s => s.id));
        const dailyAttendance = attendance.filter(a => a.date === currentDate && studentIds.has(a.studentId));
        
        const present = dailyAttendance.filter(a => a.status === AttendanceStatus.Present).length;
        const absent = dailyAttendance.filter(a => a.status === AttendanceStatus.Absent).length;
        const leave = dailyAttendance.filter(a => a.status === AttendanceStatus.Leave).length;
        const total = studentsToDisplay.length;

        return { total, present, absent, leave };
    }, [studentsToDisplay, attendance, currentDate]);

    const monthlyAttendanceData = useMemo(() => {
        const data = new Map<string, { present: number, absent: number, leave: number, total: number, status?: AttendanceStatus }>();
        const studentIds = new Set((selectedStudent ? [selectedStudent] : studentsToDisplay).map(s => s.id));
        
        const relevantAttendance = attendance.filter(a => studentIds.has(a.studentId));

        for (const record of relevantAttendance) {
            if (selectedStudent) {
                data.set(record.date, { ...data.get(record.date)!, status: record.status });
            } else {
                const dayData = data.get(record.date) || { present: 0, absent: 0, leave: 0, total: studentIds.size };
                if (record.status === AttendanceStatus.Present) dayData.present++;
                else if (record.status === AttendanceStatus.Absent) dayData.absent++;
                else if (record.status === AttendanceStatus.Leave) dayData.leave++;
                data.set(record.date, dayData);
            }
        }
        return data;
    }, [attendance, studentsToDisplay, selectedStudent]);


    const handleStatusChange = useCallback((studentId: string, status: AttendanceStatus) => {
        setAttendance(prev => {
            const otherRecords = prev.filter(a => !(a.studentId === studentId && a.date === currentDate));
            return [...otherRecords, { studentId, date: currentDate, status }];
        });
    }, [currentDate, setAttendance]);

    const handleClearStatus = useCallback((studentId: string) => {
        setAttendance(prev => prev.filter(a => !(a.studentId === studentId && a.date === currentDate)));
    }, [currentDate, setAttendance]);

    const getStudentStatus = (studentId: string) => attendance.find(a => a.studentId === studentId && a.date === currentDate)?.status;

    const markAll = (status: AttendanceStatus) => {
        setAttendance(prev => {
            const otherRecords = prev.filter(a => a.date !== currentDate || !studentsToDisplay.some(s => s.id === a.studentId));
            const newRecords = studentsToDisplay.map(s => ({ studentId: s.id, date: currentDate, status }));
            return [...otherRecords, ...newRecords];
        });
    };

    const generateCalendarDays = () => {
        const days = [];
        const year = calendarMonth.getFullYear();
        const month = calendarMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDayOfWeek = firstDay.getDay();

        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(null); // padding
        }
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };
    
    const renderCalendarCell = (day: Date | null) => {
        if (!day) return <div key={`pad-${Math.random()}`} className="border-r border-b"></div>;
        
        const dateStr = day.toISOString().split('T')[0];
        const dayData = monthlyAttendanceData.get(dateStr);
        let bgColor = 'bg-white hover:bg-sky-100';
        let content = <p>{day.getDate()}</p>;

        if (selectedStudent) {
            if (dayData?.status === AttendanceStatus.Present) bgColor = 'bg-emerald-300';
            if (dayData?.status === AttendanceStatus.Absent) bgColor = 'bg-rose-300';
            if (dayData?.status === AttendanceStatus.Leave) bgColor = 'bg-amber-300';
        } else if (dayData) {
            const percentage = dayData.total > 0 ? (dayData.present / dayData.total) * 100 : 0;
            if (percentage >= 90) bgColor = 'bg-emerald-400 text-white';
            else if (percentage >= 70) bgColor = 'bg-emerald-200';
            else if (dayData.present > 0) bgColor = 'bg-amber-200';
            else if (dayData.total > 0 && (dayData.absent > 0 || dayData.leave > 0)) bgColor = 'bg-rose-200';
            content = (
                <div className="text-center">
                    <p className="font-bold">{day.getDate()}</p>
                    <p className="text-xs">{percentage.toFixed(0)}%</p>
                </div>
            );
        }
        
        if (dateStr === currentDate) bgColor += ' ring-2 ring-primary';

        return (
            <button key={dateStr} onClick={() => setCurrentDate(dateStr)} className={`p-1 text-sm border-r border-b text-center transition-colors duration-200 ${bgColor}`}>
                {content}
            </button>
        );
    };


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-on-surface">Attendance Management</h1>
            
            <div className="lg:grid lg:grid-cols-5 lg:gap-6 space-y-6 lg:space-y-0">
                {/* Left Column: Controls & List */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-surface p-4 rounded-xl shadow-lg flex flex-col md:flex-row gap-4 items-center">
                        <div className="w-full md:w-1/3">
                            <label htmlFor="class-select" className="block text-sm font-medium text-gray-700">Filter Group</label>
                            <select id="class-select" className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" value={filter} onChange={e => { setFilter(e.target.value); setSelectedStudent(null); }}>
                                <optgroup label="By Track">
                                    <option value="dars-e-nizami-all">All Dars-e-Nizami</option>
                                    <option value="hifz-all">All Hifz</option>
                                </optgroup>
                                {darsENizamiClasses.length > 0 && <optgroup label="Dars-e-Nizami">{darsENizamiClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</optgroup>}
                                {hifzClasses.length > 0 && <optgroup label="Hifz">{hifzClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</optgroup>}
                            </select>
                        </div>
                        <div className="w-full md:w-1/3">
                             <label htmlFor="date-select" className="block text-sm font-medium text-gray-700">Marking Date</label>
                            <input id="date-select" type="date" className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" value={currentDate} onChange={e => setCurrentDate(e.target.value)} />
                        </div>
                         <div className="w-full md:w-1/3">
                            <label htmlFor="student-search" className="block text-sm font-medium text-gray-700">Search Student</label>
                            <input
                                id="student-search"
                                type="text"
                                placeholder="Filter by name..."
                                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-surface p-4 rounded-xl shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                             <h2 className="font-bold text-lg text-on-surface">Mark Attendance for {new Date(currentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>
                             <div className="flex gap-2">
                                <button onClick={() => markAll(AttendanceStatus.Present)} className="px-3 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full hover:bg-emerald-200">Mark All Present</button>
                                <button onClick={() => markAll(AttendanceStatus.Absent)} className="px-3 py-1 text-xs bg-rose-100 text-rose-800 rounded-full hover:bg-rose-200">Mark All Absent</button>
                            </div>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {studentsToDisplay.map(student => (
                                        <tr key={student.id} onClick={() => setSelectedStudent(student)} className={`cursor-pointer hover:bg-sky-50 ${selectedStudent?.id === student.id ? 'bg-sky-100' : ''}`}>
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <img className="h-10 w-10 rounded-full object-cover" src={student.picture} alt={student.name} />
                                                    <div className="ml-3"><div className="text-sm font-medium text-gray-900">{student.name}</div></div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-1 md:gap-2">
                                                    {[AttendanceStatus.Present, AttendanceStatus.Absent, AttendanceStatus.Leave].map(status => (
                                                         <button key={status} onClick={(e) => { e.stopPropagation(); handleStatusChange(student.id, status)}} className={`px-3 py-1 text-sm font-bold rounded-full w-10 transition-all ${getStudentStatus(student.id) === status ? {P:'bg-emerald-500 text-white',A:'bg-rose-500 text-white',L:'bg-amber-500 text-white'}[status[0]] : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{status[0]}</button>
                                                    ))}
                                                    <button onClick={(e) => { e.stopPropagation(); handleClearStatus(student.id)}} className={`px-3 py-1 text-sm font-bold rounded-full w-10 transition-all ${!getStudentStatus(student.id) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>C</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                             {studentsToDisplay.length === 0 && <p className="text-center text-gray-500 py-8">No students found.</p>}
                        </div>
                    </div>
                </div>

                {/* Right Column: Calendar & Stats */}
                <div className="lg:col-span-2 space-y-6">
                     <div className="bg-surface p-4 rounded-xl shadow-lg">
                        <h3 className="font-bold text-lg text-on-surface mb-2">Daily Statistics</h3>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-sky-50 rounded-lg flex items-center gap-3"><UserGroupIcon className="h-8 w-8 text-sky-600"/><p><span className="text-xl font-bold text-sky-800">{dailyStats.total}</span><br/><span className="text-xs">Total</span></p></div>
                            <div className="p-3 bg-emerald-50 rounded-lg flex items-center gap-3"><CheckBadgeIcon className="h-8 w-8 text-emerald-600"/><p><span className="text-xl font-bold text-emerald-800">{dailyStats.present}</span><br/><span className="text-xs">Present</span></p></div>
                            <div className="p-3 bg-rose-50 rounded-lg flex items-center gap-3"><XCircleIcon className="h-8 w-8 text-rose-600"/><p><span className="text-xl font-bold text-rose-800">{dailyStats.absent}</span><br/><span className="text-xs">Absent</span></p></div>
                            <div className="p-3 bg-amber-50 rounded-lg flex items-center gap-3"><ExclamationTriangleIcon className="h-8 w-8 text-amber-600"/><p><span className="text-xl font-bold text-amber-800">{dailyStats.leave}</span><br/><span className="text-xs">Leave</span></p></div>
                        </div>
                    </div>

                    <div className="bg-surface p-4 rounded-xl shadow-lg">
                        <div className="flex justify-between items-center mb-2">
                             <div>
                                <h3 className="font-bold text-lg text-on-surface">Calendar View</h3>
                                <p className="text-xs text-gray-500">{selectedStudent ? `${selectedStudent.name}` : 'Group Overview'}</p>
                             </div>
                             {selectedStudent && <button onClick={() => setSelectedStudent(null)} className="text-xs px-2 py-1 bg-gray-200 rounded-full hover:bg-gray-300">Show Group</button>}
                        </div>
                        <div className="flex items-center justify-between my-2">
                             <button onClick={() => setCalendarMonth(new Date(calendarMonth.setMonth(calendarMonth.getMonth() - 1)))} className="p-1 rounded-full hover:bg-gray-200"><ChevronLeftIcon className="h-5 w-5"/></button>
                            <span className="font-semibold text-center">{calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                             <button onClick={() => setCalendarMonth(new Date(calendarMonth.setMonth(calendarMonth.getMonth() + 1)))} className="p-1 rounded-full hover:bg-gray-200"><ChevronRightIcon className="h-5 w-5"/></button>
                        </div>
                        <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-500 border-t border-b py-1">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
                        </div>
                        <div className="grid grid-cols-7 border-l border-t">
                            {generateCalendarDays().map(renderCalendarCell)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;