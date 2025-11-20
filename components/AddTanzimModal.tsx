
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { TanzimRecord, FeeStatus, AcademicTrack } from '../types';
import { PhotographIcon } from './Icons';

interface AddTanzimModalProps {
    onClose: () => void;
    onSave: (record: Omit<TanzimRecord, 'id'> & { id?: string }) => void;
    recordToEdit?: TanzimRecord | null;
}

const ImageInput: React.FC<{ label: string; preview: string | null; onImageChange: (file: File) => void; }> = ({ label, preview, onImageChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="mt-1 flex items-center gap-4">
            {preview ? (
                <img src={preview} alt="Preview" className="w-16 h-16 rounded-lg object-cover border" />
            ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                    <PhotographIcon className="w-8 h-8"/>
                </div>
            )}
            <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => e.target.files?.[0] && onImageChange(e.target.files[0])} 
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
            />
        </div>
    </div>
);


const AddTanzimModal: React.FC<AddTanzimModalProps> = ({ onClose, onSave, recordToEdit }) => {
    const { students, classes } = useAppContext();
    const isEditing = !!recordToEdit;
    const darsENizamiClasses = classes.filter(c => c.track === AcademicTrack.DarsENizami);
    
    const [formData, setFormData] = useState<Omit<TanzimRecord, 'id'>>({
        studentId: students[0]?.id || '',
        examYear: new Date().getFullYear() + 1,
        tanzimClassId: darsENizamiClasses[0]?.id || '',
        admissionFee: 0,
        feeStatus: FeeStatus.Pending,
        feeReceiptNumber: '',
        otherFeeAmount: 0,
        otherFeeStatus: FeeStatus.Pending,
        otherFeeReceiptNumber: '',
        cnicBFormCopy: '',
        passportPhoto1: '',
        passportPhoto2: '',
        feeReceiptCopy: '',
        requiredDocuments: {
            cnicBForm: false,
            passportPhotos: false,
            feeReceipt: false,
        },
    });

    const [previews, setPreviews] = useState({
        cnicBFormCopy: null as string | null,
        passportPhoto1: null as string | null,
        passportPhoto2: null as string | null,
        feeReceiptCopy: null as string | null,
    });
    
    useEffect(() => {
        if (recordToEdit) {
            setFormData(recordToEdit);
            setPreviews({
                cnicBFormCopy: recordToEdit.cnicBFormCopy,
                passportPhoto1: recordToEdit.passportPhoto1,
                passportPhoto2: recordToEdit.passportPhoto2,
                feeReceiptCopy: recordToEdit.feeReceiptCopy,
            });
        }
    }, [recordToEdit]);

    const [errors, setErrors] = useState<any>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'number' ? parseFloat(value) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            requiredDocuments: {
                ...prev.requiredDocuments,
                [name]: checked,
            }
        }));
    };
    
    const handleImageChange = (file: File, field: keyof typeof previews) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setPreviews(prev => ({ ...prev, [field]: result }));
            setFormData(prev => ({ ...prev, [field]: result }));
        };
        reader.readAsDataURL(file);
    };
    
    const validate = () => {
        const newErrors: any = {};
        if (!formData.studentId) newErrors.studentId = 'Please select a student';
        if (!formData.examYear) newErrors.examYear = 'Exam year is required';
        if (!formData.tanzimClassId) newErrors.tanzimClassId = 'Exam class is required';
        if (formData.admissionFee <= 0) newErrors.admissionFee = 'Fee must be greater than zero';
        if (formData.feeStatus === FeeStatus.Paid && !formData.feeReceiptNumber) {
            newErrors.feeReceiptNumber = 'Receipt number is required for paid fees';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave({ ...formData, id: recordToEdit?.id });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
            <div className="bg-surface rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-on-surface">{isEditing ? 'Edit Tanzim Record' : 'Add New Tanzim Record'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <fieldset className="border p-4 rounded-lg">
                        <legend className="px-2 font-semibold text-primary">Student & Exam Details</legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                             <div>
                                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">Student</label>
                                <select name="studentId" id="studentId" value={formData.studentId} onChange={handleChange} className={`mt-1 block w-full p-2 border ${errors.studentId ? 'border-red-500' : 'border-gray-300'} rounded-md`} required>
                                    <option value="" disabled>Select a student</option>
                                    {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                                {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId}</p>}
                            </div>
                             <div>
                               <label htmlFor="tanzimClassId" className="block text-sm font-medium text-gray-700">Exam Class</label>
                               <select name="tanzimClassId" id="tanzimClassId" value={formData.tanzimClassId} onChange={handleChange} className={`mt-1 block w-full p-2 border ${errors.tanzimClassId ? 'border-red-500' : 'border-gray-300'} rounded-md`} required>
                                   <option value="" disabled>Select exam class</option>
                                   {darsENizamiClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                               </select>
                               {errors.tanzimClassId && <p className="text-red-500 text-xs mt-1">{errors.tanzimClassId}</p>}
                           </div>
                            <div>
                                <label htmlFor="examYear" className="block text-sm font-medium text-gray-700">Exam Year</label>
                                <input type="number" name="examYear" id="examYear" value={formData.examYear} onChange={handleChange} className={`mt-1 block w-full p-2 border ${errors.examYear ? 'border-red-500' : 'border-gray-300'} rounded-md`} required />
                                {errors.examYear && <p className="text-red-500 text-xs mt-1">{errors.examYear}</p>}
                            </div>
                        </div>
                    </fieldset>
                    
                     <fieldset className="border p-4 rounded-lg">
                        <legend className="px-2 font-semibold text-primary">Admission Fee Details</legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                             <div>
                                <label htmlFor="admissionFee" className="block text-sm font-medium text-gray-700">Fee (Rs.)</label>
                                <input type="number" name="admissionFee" id="admissionFee" value={formData.admissionFee} onChange={handleChange} className={`mt-1 block w-full p-2 border ${errors.admissionFee ? 'border-red-500' : 'border-gray-300'} rounded-md`} required />
                                {errors.admissionFee && <p className="text-red-500 text-xs mt-1">{errors.admissionFee}</p>}
                            </div>
                            <div>
                                <label htmlFor="feeStatus" className="block text-sm font-medium text-gray-700">Status</label>
                                <select name="feeStatus" id="feeStatus" value={formData.feeStatus} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                                    <option value={FeeStatus.Pending}>Pending</option>
                                    <option value={FeeStatus.Paid}>Paid</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="feeReceiptNumber" className="block text-sm font-medium text-gray-700">Receipt No.</label>
                                <input type="text" name="feeReceiptNumber" id="feeReceiptNumber" value={formData.feeReceiptNumber} onChange={handleChange} className={`mt-1 block w-full p-2 border ${errors.feeReceiptNumber ? 'border-red-500' : 'border-gray-300'} rounded-md`} />
                                 {errors.feeReceiptNumber && <p className="text-red-500 text-xs mt-1">{errors.feeReceiptNumber}</p>}
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className="border p-4 rounded-lg">
                        <legend className="px-2 font-semibold text-primary">Other Tanzim Fee (Optional)</legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                             <div>
                                <label htmlFor="otherFeeAmount" className="block text-sm font-medium text-gray-700">Other Fee (Rs.)</label>
                                <input type="number" name="otherFeeAmount" id="otherFeeAmount" value={formData.otherFeeAmount || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="otherFeeStatus" className="block text-sm font-medium text-gray-700">Status</label>
                                <select name="otherFeeStatus" id="otherFeeStatus" value={formData.otherFeeStatus || FeeStatus.Pending} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                                    <option value={FeeStatus.Pending}>Pending</option>
                                    <option value={FeeStatus.Paid}>Paid</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="otherFeeReceiptNumber" className="block text-sm font-medium text-gray-700">Receipt No.</label>
                                <input type="text" name="otherFeeReceiptNumber" id="otherFeeReceiptNumber" value={formData.otherFeeReceiptNumber || ''} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                        </div>
                    </fieldset>
                    
                     <fieldset className="border p-4 rounded-lg">
                        <legend className="px-2 font-semibold text-primary">Required Documents Checklist</legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                           <label className="flex items-center space-x-2 p-2 rounded-md hover:bg-sky-50 cursor-pointer">
                                <input type="checkbox" name="cnicBForm" checked={formData.requiredDocuments.cnicBForm} onChange={handleCheckboxChange} className="h-4 w-4 rounded text-primary focus:ring-primary"/>
                                <span className="text-sm">CNIC / B-Form</span>
                            </label>
                             <label className="flex items-center space-x-2 p-2 rounded-md hover:bg-sky-50 cursor-pointer">
                                <input type="checkbox" name="passportPhotos" checked={formData.requiredDocuments.passportPhotos} onChange={handleCheckboxChange} className="h-4 w-4 rounded text-primary focus:ring-primary"/>
                                <span className="text-sm">Passport Photos</span>
                            </label>
                             <label className="flex items-center space-x-2 p-2 rounded-md hover:bg-sky-50 cursor-pointer">
                                <input type="checkbox" name="feeReceipt" checked={formData.requiredDocuments.feeReceipt} onChange={handleCheckboxChange} className="h-4 w-4 rounded text-primary focus:ring-primary"/>
                                <span className="text-sm">Fee Receipt</span>
                            </label>
                        </div>
                    </fieldset>

                     <fieldset className="border p-4 rounded-lg">
                        <legend className="px-2 font-semibold text-primary">Upload Documents</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                           <ImageInput label="CNIC / B-Form Copy" preview={previews.cnicBFormCopy} onImageChange={(file) => handleImageChange(file, 'cnicBFormCopy')} />
                           <ImageInput label="Fee Receipt Copy" preview={previews.feeReceiptCopy} onImageChange={(file) => handleImageChange(file, 'feeReceiptCopy')} />
                           <ImageInput label="Passport-sized Photo 1" preview={previews.passportPhoto1} onImageChange={(file) => handleImageChange(file, 'passportPhoto1')} />
                           <ImageInput label="Passport-sized Photo 2" preview={previews.passportPhoto2} onImageChange={(file) => handleImageChange(file, 'passportPhoto2')} />
                        </div>
                    </fieldset>

                    <div className="flex justify-end gap-4 pt-4 border-t mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark">{isEditing ? 'Save Changes' : 'Save Record'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTanzimModal;