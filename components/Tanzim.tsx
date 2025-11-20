
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { FeeStatus, TanzimRecord } from '../types';
import { PlusIcon, PencilIcon, TrashIcon, BuildingLibraryIcon, PhotographIcon, CheckCircleIcon } from './Icons';
import AddTanzimModal from './AddTanzimModal';
import WhatsappLink from './WhatsappLink';

const getStatusBadge = (status: FeeStatus) => {
    switch (status) {
        case FeeStatus.Paid: return 'bg-emerald-100 text-emerald-800';
        case FeeStatus.Pending: return 'bg-amber-100 text-amber-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const ImagePreview: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
    <div className="w-full">
        <p className="text-sm font-semibold text-gray-600 mb-1">{alt}</p>
        {src ? (
            <img src={src} alt={alt} className="w-full h-auto rounded-lg border object-cover" />
        ) : (
            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                <PhotographIcon className="h-10 w-10" />
            </div>
        )}
    </div>
);


const Tanzim: React.FC = () => {
    const { tanzimRecords, setTanzimRecords, students, classes } = useAppContext();
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recordToEdit, setRecordToEdit] = useState<TanzimRecord | null>(null);

    const studentMap = useMemo(() => new Map(students.map(s => [s.id, s])), [students]);
    const classMap = useMemo(() => new Map(classes.map(c => [c.id, c])), [classes]);

    const toggleExpand = (id: string) => setExpandedId(expandedId === id ? null : id);
    
    const handleOpenAddModal = () => {
        setRecordToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (record: TanzimRecord) => {
        setRecordToEdit(record);
        setIsModalOpen(true);
    };

    const handleRemoveRecord = (recordId: string) => {
        if (window.confirm('Are you sure you want to remove this admission record?')) {
            setTanzimRecords(prev => prev.filter(r => r.id !== recordId));
        }
    };

    const handleSaveRecord = (recordData: Omit<TanzimRecord, 'id'> & { id?: string }) => {
        if (recordData.id) { // Editing
            setTanzimRecords(prev => prev.map(r => r.id === recordData.id ? { ...r, ...recordData } as TanzimRecord : r));
        } else { // Adding
            const newRecord: TanzimRecord = { ...recordData, id: `tz${Date.now()}` };
            setTanzimRecords(prev => [...prev, newRecord]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-on-surface">Tanzim-ul-Madaris Admissions</h1>
                <button
                    onClick={handleOpenAddModal}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-all transform hover:scale-105"
                >
                    <PlusIcon className="h-5 w-5" />
                    Add New Record
                </button>
            </div>
            <div className="space-y-4">
                {tanzimRecords.map(record => {
                    const student = studentMap.get(record.studentId);
                    const studentClass = student ? classMap.get(student.classId) : null;
                    const tanzimClass = record.tanzimClassId ? classMap.get(record.tanzimClassId) : null;
                    return (
                        <div key={record.id} className="bg-surface rounded-xl shadow-lg overflow-hidden transition-all duration-300 group">
                            <div className="p-4 flex flex-col sm:flex-row items-center gap-4 relative">
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button onClick={() => handleOpenEditModal(record)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"><PencilIcon className="h-5 w-5"/></button>
                                    <button onClick={() => handleRemoveRecord(record.id)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"><TrashIcon className="h-5 w-5"/></button>
                                </div>
                                <img 
                                    src={student?.picture || ''} 
                                    alt={student?.name || 'Student'} 
                                    className="w-20 h-20 rounded-full object-cover border-4 border-secondary"
                                />
                                <div className="flex-1 text-center sm:text-left">
                                    <h2 className="text-xl font-bold text-on-surface">{student?.name || 'Unknown Student'}</h2>
                                    <p className="text-gray-600">{studentClass?.name || 'Unknown Class'}</p>
                                    <p className="text-sm text-gray-500">Exam: {tanzimClass?.name || 'N/A'} ({record.examYear})</p>
                                </div>
                                <div className="text-center sm:text-right">
                                    <p className="font-semibold text-sm">Admission Fee</p>
                                    <span className={`mt-1 inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(record.feeStatus)}`}>
                                        {record.feeStatus}
                                    </span>
                                </div>
                                 <div className="text-center sm:text-right">
                                    <p className="font-semibold text-sm">Other Fee</p>
                                    <span className={`mt-1 inline-block px-3 py-1 text-xs font-semibold rounded-full ${record.otherFeeStatus ? getStatusBadge(record.otherFeeStatus) : 'bg-gray-100 text-gray-400'}`}>
                                        {record.otherFeeStatus || 'N/A'}
                                    </span>
                                </div>
                                <button className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors" onClick={() => toggleExpand(record.id)}>
                                    {expandedId === record.id ? 'Hide Details' : 'View Details'}
                                </button>
                            </div>

                            {expandedId === record.id && (
                                <div className="p-6 border-t border-gray-200 bg-sky-50/50 animate-fade-in space-y-6">
                                    {student && (
                                        <div className="p-4 bg-white rounded-lg shadow">
                                            <h4 className="text-md font-semibold text-on-surface mb-2">Student Information</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                                <p><strong className="text-gray-600">Father's Name:</strong> {student.fatherName}</p>
                                                <p><strong className="text-gray-600">B-Form:</strong> {student.bForm}</p>
                                                <div className="md:col-span-2 flex items-center gap-1">
                                                    <strong className="text-gray-600">Contact:</strong> 
                                                    <WhatsappLink phone={student.phone} />
                                                </div>
                                                <p className="md:col-span-2"><strong className="text-gray-600">Address:</strong> {student.address}</p>
                                            </div>
                                        </div>
                                    )}
                                     <div className="p-4 bg-white rounded-lg shadow">
                                       <h4 className="text-md font-semibold text-on-surface mb-2">Examination Details</h4>
                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                           <p><strong className="text-gray-600">Exam Year:</strong> {record.examYear}</p>
                                           <p><strong className="text-gray-600">Exam Class:</strong> {tanzimClass?.name || 'N/A'}</p>
                                       </div>
                                   </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Admission Fee Details */}
                                        <div className="p-4 bg-white rounded-lg shadow">
                                            <h4 className="text-md font-semibold text-on-surface mb-2">Admission Fee Details</h4>
                                            <div className="space-y-1 text-sm">
                                                <p><strong className="text-gray-600">Amount:</strong> Rs. {record.admissionFee.toLocaleString()}</p>
                                                <p><strong className="text-gray-600">Status:</strong> <span className={`font-semibold ${record.feeStatus === FeeStatus.Paid ? 'text-emerald-700':'text-amber-700'}`}>{record.feeStatus}</span></p>
                                                <p><strong className="text-gray-600">Receipt/Challan No:</strong> {record.feeReceiptNumber || 'N/A'}</p>
                                            </div>
                                        </div>
                                         {/* Other Fee Details */}
                                        <div className="p-4 bg-white rounded-lg shadow">
                                             <h4 className="text-md font-semibold text-on-surface mb-2">Other Fee Details</h4>
                                             {record.otherFeeAmount ? (
                                                <div className="space-y-1 text-sm">
                                                    <p><strong className="text-gray-600">Amount:</strong> Rs. {record.otherFeeAmount.toLocaleString()}</p>
                                                    <p><strong className="text-gray-600">Status:</strong> <span className={`font-semibold ${record.otherFeeStatus === FeeStatus.Paid ? 'text-emerald-700':'text-amber-700'}`}>{record.otherFeeStatus}</span></p>
                                                    <p><strong className="text-gray-600">Receipt/Challan No:</strong> {record.otherFeeReceiptNumber || 'N/A'}</p>
                                                </div>
                                             ) : <p className="text-sm text-gray-500">No other fees recorded.</p>}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-md font-semibold text-on-surface mb-2">Required Documents Status</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                            <div className={`flex items-center p-2 rounded-md shadow-sm ${record.requiredDocuments.cnicBForm ? 'bg-white' : 'bg-gray-100'}`}>
                                                <CheckCircleIcon className={`h-5 w-5 mr-2 ${record.requiredDocuments.cnicBForm ? 'text-emerald-500' : 'text-gray-300'}`}/>
                                                <span className={`text-sm ${record.requiredDocuments.cnicBForm ? 'text-gray-700' : 'text-gray-400'}`}>CNIC / B-Form</span>
                                            </div>
                                            <div className={`flex items-center p-2 rounded-md shadow-sm ${record.requiredDocuments.passportPhotos ? 'bg-white' : 'bg-gray-100'}`}>
                                                <CheckCircleIcon className={`h-5 w-5 mr-2 ${record.requiredDocuments.passportPhotos ? 'text-emerald-500' : 'text-gray-300'}`}/>
                                                <span className={`text-sm ${record.requiredDocuments.passportPhotos ? 'text-gray-700' : 'text-gray-400'}`}>Passport Photos</span>
                                            </div>
                                            <div className={`flex items-center p-2 rounded-md shadow-sm ${record.requiredDocuments.feeReceipt ? 'bg-white' : 'bg-gray-100'}`}>
                                                <CheckCircleIcon className={`h-5 w-5 mr-2 ${record.requiredDocuments.feeReceipt ? 'text-emerald-500' : 'text-gray-300'}`}/>
                                                <span className={`text-sm ${record.requiredDocuments.feeReceipt ? 'text-gray-700' : 'text-gray-400'}`}>Fee Receipt</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t mt-4">
                                        <ImagePreview src={record.cnicBFormCopy} alt="CNIC / B-Form" />
                                        <ImagePreview src={record.passportPhoto1} alt="Passport Photo 1" />
                                        <ImagePreview src={record.passportPhoto2} alt="Passport Photo 2" />
                                        <ImagePreview src={record.feeReceiptCopy} alt="Fee Receipt" />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
                {tanzimRecords.length === 0 && (
                     <div className="text-center py-12 bg-surface rounded-xl shadow-lg">
                        <BuildingLibraryIcon className="h-16 w-16 mx-auto text-gray-400"/>
                        <p className="mt-4 text-gray-500">No Tanzim-ul-Madaris records found.</p>
                    </div>
                )}
            </div>
            {isModalOpen && <AddTanzimModal onClose={() => setIsModalOpen(false)} onSave={handleSaveRecord} recordToEdit={recordToEdit} />}
        </div>
    );
};

export default Tanzim;