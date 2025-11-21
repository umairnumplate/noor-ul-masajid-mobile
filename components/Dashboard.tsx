import React, { useMemo, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { UserGroupIcon, AcademicCapIcon, ClipboardCheckIcon, BuildingLibraryIcon, CashIcon, ExclamationTriangleIcon, SparklesIcon } from './Icons';
import { FeeStatus, Announcement } from '../types';
import { isGeminiAvailable } from '../lib/gemini';
import GenerateAnnouncementModal from './GenerateAnnouncementModal';

const Dashboard: React.FC = () => {
    const { students, teachers, announcements, setAnnouncements, attendance, tanzimRecords, madrasaFeeRecords } = useAppContext();
    const today = new Date().toISOString().split('T')[0];
    const presentToday = attendance.filter(a => a.date === today && a.status === 'Present').length;
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    
    const pendingMadrasaFeesAmount = useMemo(() => {
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        return madrasaFeeRecords
            .filter(fee => fee.month === currentMonth && fee.status === FeeStatus.Pending)
            .reduce((total, fee) => total + fee.amount, 0);
    }, [madrasaFeeRecords]);

    const pendingTanzimFeesAmount = useMemo(() => {
        return tanzimRecords.reduce((total, record) => {
            let pendingAmount = 0;
            if (record.feeStatus === FeeStatus.Pending) {
                pendingAmount += record.admissionFee;
            }
            if (record.otherFeeStatus === FeeStatus.Pending && record.otherFeeAmount) {
                pendingAmount += record.otherFeeAmount;
            }
            return total + pendingAmount;
        }, 0);
    }, [tanzimRecords]);


    const stats = [
        { name: 'Total Students', value: students.length, icon: UserGroupIcon, color: 'text-sky-600', bgColor: 'bg-sky-100', isCurrency: false },
        { name: 'Total Teachers', value: teachers.length, icon: AcademicCapIcon, color: 'text-amber-600', bgColor: 'bg-amber-100', isCurrency: false },
        { name: 'Present Today', value: presentToday, icon: ClipboardCheckIcon, color: 'text-emerald-600', bgColor: 'bg-emerald-100', isCurrency: false },
        { name: 'Tanzim Admissions', value: tanzimRecords.length, icon: BuildingLibraryIcon, color: 'text-indigo-600', bgColor: 'bg-indigo-100', isCurrency: false },
        { name: 'Pending Madrasa Fees', value: pendingMadrasaFeesAmount, icon: ExclamationTriangleIcon, color: 'text-rose-600', bgColor: 'bg-rose-100', isCurrency: true, subtext: '(Current Month)' },
        { name: 'Pending Tanzim Fees', value: pendingTanzimFeesAmount, icon: CashIcon, color: 'text-orange-600', bgColor: 'bg-orange-100', isCurrency: true, subtext: '(Total Pending)' },
    ];

    const handleGenerateAnnouncement = (announcement: { title: string, content: string }) => {
        const newAnnouncement: Announcement = {
            id: `anno${Date.now()}`,
            date: new Date().toISOString(),
            ...announcement,
        };
        setAnnouncements(prev => [newAnnouncement, ...prev]);
        setIsAiModalOpen(false);
    };

    return (
        <div className="space-y-8">
            <div className="bg-surface rounded-xl shadow-sm p-6 border border-stroke">
              <h1 className="text-3xl font-bold text-on-surface">Welcome Back!</h1>
              <p className="text-on-surface-light mt-1">Here's a summary of your Madrasa's activities.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-surface rounded-xl shadow-sm p-6 flex items-start justify-between border border-stroke transform hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <div>
                            <p className="text-md font-semibold text-on-surface-light">{stat.name} {stat.subtext && <span className="text-xs">{stat.subtext}</span>}</p>
                            <p className="text-3xl font-bold text-on-surface mt-2">
                                {stat.isCurrency && 'Rs. '}
                                {stat.value.toLocaleString()}
                            </p>
                        </div>
                         <div className={`p-3 rounded-full ${stat.bgColor}`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-surface rounded-xl shadow-sm p-6 border border-stroke">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-on-surface">📢 Important Announcements</h2>
                    {isGeminiAvailable() && (
                        <button
                            onClick={() => setIsAiModalOpen(true)}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-primary-light text-primary-darker font-bold rounded-lg shadow-sm hover:bg-teal-300 transition-all transform hover:scale-105"
                        >
                            <SparklesIcon className="h-5 w-5" />
                            Generate with AI
                        </button>
                    )}
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {announcements.length > 0 ? (
                        announcements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(anno => (
                            <div key={anno.id} className="p-4 border-l-4 border-secondary bg-secondary/10 rounded-r-lg">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-amber-800">{anno.title}</h3>
                                    <span className="text-xs text-on-surface-light">{new Date(anno.date).toLocaleDateString()}</span>
                                </div>
                                <p className="mt-1 text-on-surface-light">{anno.content}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-on-surface-light py-8">No announcements at the moment.</p>
                    )}
                </div>
            </div>
            {isAiModalOpen && <GenerateAnnouncementModal onClose={() => setIsAiModalOpen(false)} onGenerate={handleGenerateAnnouncement} />}
        </div>
    );
};

export default Dashboard;