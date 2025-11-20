import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AcademicTrack, SanadStatus, Graduate as GraduateType } from '../types';
import { CheckCircleIcon, GraduationCapIcon, PlusIcon, PencilIcon, TrashIcon } from './Icons';
import AddGraduateModal from './AddAlumniModal';
import WhatsappLink from './WhatsappLink';


const getStatusBadge = (status: SanadStatus) => {
    switch (status) {
        case SanadStatus.Received:
            return 'bg-emerald-100 text-emerald-800';
        case SanadStatus.PendingCollection:
            return 'bg-amber-100 text-amber-800';
        case SanadStatus.NotYetIssued:
            return 'bg-rose-100 text-rose-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const Graduates: React.FC = () => {
    const { graduates, classes, setGraduates } = useAppContext();
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [graduateToEdit, setGraduateToEdit] = useState<GraduateType | null>(null);

    const darsENizamiClasses = classes.filter(c => c.track === AcademicTrack.DarsENizami);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleOpenAddModal = () => {
        setGraduateToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (graduate: GraduateType) => {
        setGraduateToEdit(graduate);
        setIsModalOpen(true);
    };

    const handleRemoveGraduate = (graduateId: string) => {
        if (window.confirm('Are you sure you want to remove this graduate?')) {
            setGraduates(prev => prev.filter(a => a.id !== graduateId));
        }
    };

     const handleSaveGraduate = (graduateData: Omit<GraduateType, 'id'> & { id?: string }) => {
        if (graduateData.id) { // Editing
             setGraduates(prev => prev.map(a => a.id === graduateData.id ? { ...a, ...graduateData } as GraduateType : a));
        } else { // Adding
            const newGraduate: GraduateType = {
                ...graduateData,
                id: `a${Date.now()}`,
                picture: graduateData.picture || `https://picsum.photos/seed/s${Date.now()}/200`,
                alumniPicture: graduateData.alumniPicture || graduateData.picture || `https://picsum.photos/seed/a-grad-${Date.now()}/200`,
            };
            setGraduates(prev => [...prev, newGraduate]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-on-surface">Graduate Management</h1>
                 <button
                    onClick={handleOpenAddModal}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-all transform hover:scale-105"
                >
                    <PlusIcon className="h-5 w-5" />
                    Add New Graduate
                </button>
            </div>
            <div className="space-y-4">
                {graduates.map(grad => (
                    <div key={grad.id} className="bg-surface rounded-xl shadow-lg overflow-hidden transition-all duration-300">
                        <div className="p-4 flex flex-col sm:flex-row items-center gap-4 relative">
                             <div className="absolute top-4 right-4 flex gap-2 z-10">
                                <button onClick={(e) => { e.stopPropagation(); handleOpenEditModal(grad)}} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-blue-600"><PencilIcon className="h-5 w-5"/></button>
                                <button onClick={(e) => { e.stopPropagation(); handleRemoveGraduate(grad.id)}} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-rose-600"><TrashIcon className="h-5 w-5"/></button>
                            </div>
                            <img 
                                src={grad.alumniPicture || grad.picture} 
                                alt={grad.name} 
                                className="w-20 h-20 rounded-full object-cover border-4 border-secondary"
                            />
                            <div className="flex-1 text-center sm:text-left">
                                <h2 className="text-xl font-bold text-on-surface">{grad.name}</h2>
                                <p className="text-gray-600">{grad.degreeCompleted} Graduate</p>
                                <p className="text-sm text-gray-500">Graduated: {new Date(grad.graduationDate).toLocaleDateString()}</p>
                            </div>
                            <button className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors" onClick={() => toggleExpand(grad.id)}>
                                {expandedId === grad.id ? 'Hide Details' : 'View Details'}
                            </button>
                        </div>

                        {expandedId === grad.id && (
                            <div className="p-6 border-t border-gray-200 bg-sky-50/50 animate-fade-in space-y-6">
                                {/* Academic Details */}
                                {grad.degreeCompleted === AcademicTrack.DarsENizami && grad.darsENizamiProgress && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-on-surface">Dars-e-Nizami Completion Status</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {darsENizamiClasses.map(cls => (
                                                <div key={cls.id} className={`flex items-center p-2 rounded-md shadow-sm ${grad.darsENizamiProgress![cls.id] ? 'bg-white' : 'bg-gray-100'}`}>
                                                    <CheckCircleIcon className={`h-5 w-5 mr-2 ${grad.darsENizamiProgress![cls.id] ? 'text-emerald-500' : 'text-gray-300'}`}/>
                                                    <span className={`text-sm ${grad.darsENizamiProgress![cls.id] ? 'text-gray-700' : 'text-gray-400'}`}>{cls.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                         <div className="mt-4">
                                            <h4 className="font-semibold text-on-surface">Final Sanad/Certificate Status</h4>
                                            <span className={`mt-1 inline-block px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(grad.darsENizamiSanadStatus!)}`}>
                                                {grad.darsENizamiSanadStatus}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {grad.degreeCompleted === AcademicTrack.Hifz && (
                                     <div>
                                        <h3 className="text-lg font-semibold text-on-surface">Hifz Completion Status</h3>
                                        <div className="flex items-center mt-2 p-3 bg-white rounded-md shadow-sm">
                                            <CheckCircleIcon className="h-6 w-6 text-emerald-500 mr-3"/>
                                            <p className="text-gray-800">Successfully completed the memorization of the Holy Quran.</p>
                                        </div>
                                         <div className="mt-4">
                                            <h4 className="font-semibold text-on-surface">Hifz Completion Certificate Status</h4>
                                            <span className={`mt-1 inline-block px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(grad.hifzSanadStatus!)}`}>
                                                {grad.hifzSanadStatus}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Personal Information */}
                                <div className="p-4 bg-white rounded-lg shadow">
                                    <h3 className="text-lg font-semibold text-on-surface mb-3">Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                        <p><strong className="text-gray-600">B-Form:</strong> {grad.bForm || 'N/A'}</p>
                                        <p><strong className="text-gray-600">Father's Name:</strong> {grad.fatherName}</p>
                                        <p><strong className="text-gray-600">Father's CNIC:</strong> {grad.fatherCnic || 'N/A'}</p>
                                        <div className="flex items-center gap-1">
                                            <strong className="text-gray-600">Contact:</strong> 
                                            <WhatsappLink phone={grad.phone} />
                                        </div>
                                        <p className="md:col-span-2"><strong className="text-gray-600">Address:</strong> {grad.address || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {graduates.length === 0 && (
                     <div className="text-center py-12 bg-surface rounded-xl shadow-lg">
                        <GraduationCapIcon className="h-16 w-16 mx-auto text-gray-400"/>
                        <p className="mt-4 text-gray-500">No graduate records found.</p>
                    </div>
                )}
            </div>
            {isModalOpen && <AddGraduateModal onClose={() => setIsModalOpen(false)} onSave={handleSaveGraduate} graduateToEdit={graduateToEdit} />}
        </div>
    );
};

export default Graduates;