import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { AttendanceStatus } from '../types';
import WhatsappLink from './WhatsappLink';
import { WhatsAppIcon, SparklesIcon } from './Icons';
import { runGemini, isGeminiAvailable } from '../lib/gemini';

const StudentReport: React.FC = () => {
    const { studentId } = useParams<{ studentId: string }>();
    const { students, classes, attendance } = useAppContext();
    const [aiSummary, setAiSummary] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const student = students.find(s => s.id === studentId);
    const studentClass = classes.find(c => c.id === student?.classId);
    const studentAttendance = attendance.filter(a => a.studentId === studentId);

    if (!student) {
        return (
             <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
                <h1 className="text-2xl font-bold text-rose-600 mb-4">Student Not Found</h1>
                <p className="text-gray-600">The requested student report could not be generated.</p>
                <Link to="/" className="mt-6 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                    Back to Dashboard
                </Link>
            </div>
        );
    }
    
    const totalDays = studentAttendance.length;
    const presentDays = studentAttendance.filter(a => a.status === AttendanceStatus.Present).length;
    const absentDays = studentAttendance.filter(a => a.status === AttendanceStatus.Absent).length;
    const leaveDays = studentAttendance.filter(a => a.status === AttendanceStatus.Leave).length;
    const attendancePercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 'N/A';

    const defaultRemark = `${student.name} has shown excellent progress this term. Consistent effort and participation in class activities are highly appreciated.`;

    const reportText = `*Noor ul Masajid Student Report*\n\n*Name:* ${student.name}\n*Class:* ${studentClass?.name || 'N/A'}\n\n*Attendance Summary:*\n- Present: ${presentDays}\n- Absent: ${absentDays}\n- Leave: ${leaveDays}\n- Percentage: ${attendancePercentage}%\n\n*Remarks:* ${aiSummary || defaultRemark}\n\n_This is an auto-generated report._`;

    const handleShare = () => {
        let formattedPhone = student.phone.replace(/[^0-9]/g, ''); 
        if (formattedPhone.startsWith('03')) {
            formattedPhone = '92' + formattedPhone.substring(1);
        } else if (formattedPhone.startsWith('3')) {
            formattedPhone = '92' + formattedPhone;
        }
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(reportText)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleGenerateSummary = async () => {
        if (!student || !studentClass) return;
        setIsGenerating(true);
        const prompt = `
            Generate a brief, personalized performance remark for a student named ${student.name}.
            The student is in class ${studentClass.name} at Noor ul Masajid Islamic Education System.
            Here is their attendance record summary:
            - Total Days Tracked: ${totalDays}
            - Present: ${presentDays} days
            - Absent: ${absentDays} days
            - Leave: ${leaveDays} days
            - Attendance Percentage: ${attendancePercentage}%

            Based on this data, write a short (2-3 sentences), encouraging, and professional remark suitable for a parent-facing report.
            If attendance is good (>=85%), praise their consistency.
            If attendance is average (60-84%), encourage them to attend more regularly.
            If attendance is poor (<60%), mention it constructively and suggest improvement.
            Start the remark by addressing the student's progress.
        `;
        const summary = await runGemini('gemini-3-pro-preview', prompt);
        setAiSummary(summary);
        setIsGenerating(false);
    };

    return (
        <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
            <div className="max-w-2xl mx-auto bg-surface rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-primary to-teal-600 text-white">
                    <h1 className="text-3xl font-bold">Student Progress Report</h1>
                    <p className="text-teal-200">Noor ul Masajid Islamic Education System</p>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-6">
                        <img src={student.picture} alt={student.name} className="w-24 h-24 rounded-full object-cover border-4 border-secondary"/>
                        <div>
                            <h2 className="text-2xl font-bold text-on-surface">{student.name}</h2>
                            <p className="text-gray-600">Class: {studentClass?.name || 'Unknown'}</p>
                            <p className="text-sm text-gray-500">B-Form: {student.bForm}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong className="text-gray-600">Father's Name:</strong> {student.fatherName}</div>
                        <div><strong className="text-gray-600">Father's CNIC:</strong> {student.fatherCnic}</div>
                        <div className="col-span-2"><strong className="text-gray-600">Address:</strong> {student.address}</div>
                        <div className="col-span-2 flex items-center gap-2">
                           <strong className="text-gray-600">Contact:</strong> 
                           <WhatsappLink phone={student.phone} />
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold text-on-surface border-b pb-2 mb-4">Attendance Summary</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="p-3 bg-emerald-50 rounded-lg"><div className="text-2xl font-bold text-emerald-600">{presentDays}</div><div className="text-sm text-emerald-800">Present</div></div>
                            <div className="p-3 bg-rose-50 rounded-lg"><div className="text-2xl font-bold text-rose-600">{absentDays}</div><div className="text-sm text-rose-800">Absent</div></div>
                            <div className="p-3 bg-amber-50 rounded-lg"><div className="text-2xl font-bold text-amber-600">{leaveDays}</div><div className="text-sm text-amber-800">Leave</div></div>
                            <div className="p-3 bg-sky-50 rounded-lg"><div className="text-2xl font-bold text-sky-600">{attendancePercentage}%</div><div className="text-sm text-sky-800">Percentage</div></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center border-b pb-2 mb-4">
                            <h3 className="text-lg font-semibold text-on-surface">Management Remarks</h3>
                            {isGeminiAvailable() && (
                                <button 
                                    onClick={handleGenerateSummary} 
                                    disabled={isGenerating}
                                    className="inline-flex items-center gap-2 px-3 py-1 text-xs bg-primary/10 text-primary font-bold rounded-full hover:bg-primary/20 disabled:opacity-50"
                                >
                                    <SparklesIcon className="h-4 w-4" />
                                    {isGenerating ? 'Generating...' : 'Generate AI Summary'}
                                </button>
                            )}
                        </div>
                        <p className="p-4 bg-gray-100 rounded-lg text-gray-700 italic min-h-[80px]">
                            {isGenerating ? 'Please wait...' : (aiSummary || defaultRemark)}
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 text-center">
                    <button onClick={handleShare} className="inline-flex items-center gap-3 px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-all transform hover:scale-105">
                        <WhatsAppIcon className="h-6 w-6"/>
                        Share Report via WhatsApp
                    </button>
                </div>
            </div>
             <div className="text-center mt-6">
                <Link to="/" className="text-sm text-primary hover:underline">
                    &larr; Back to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default StudentReport;