
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Graduate, AcademicTrack, SanadStatus, DarsENizamiProgress } from '../types';
import { PhotographIcon } from './Icons';

interface AddGraduateModalProps {
    onClose: () => void;
    onSave: (graduate: Omit<Graduate, 'id'> & { id?: string }) => void;
    graduateToEdit?: Graduate | null;
}

const AddGraduateModal: React.FC<AddGraduateModalProps> = ({ onClose, onSave, graduateToEdit }) => {
    const { classes } = useAppContext();
    const darsENizamiClasses = classes.filter(c => c.track === AcademicTrack.DarsENizami);
    const isEditing = !!graduateToEdit;

    const initialDarsProgress = darsENizamiClasses.reduce((acc, cls) => {
        acc[cls.id] = false;
        return acc;
    }, {} as DarsENizamiProgress);
    
    const [formData, setFormData] = useState<Omit<Graduate, 'id'>>({
        name: '',
        bForm: '',
        fatherName: '',
        fatherCnic: '',
        address: '',
        phone: '',
        classId: '', // Last class attended
        picture: '',
        alumniPicture: '',
        graduationDate: new Date().toISOString().split('T')[0],
        degreeCompleted: AcademicTrack.DarsENizami,
        darsENizamiProgress: initialDarsProgress,
        darsENizamiSanadStatus: SanadStatus.NotYetIssued,
        hifzSanadStatus: SanadStatus.NotYetIssued,
    });
    
     useEffect(() => {
        if (graduateToEdit) {
            setFormData({
                ...graduateToEdit,
                darsENizamiProgress: graduateToEdit.darsENizamiProgress || initialDarsProgress,
            });
            if (graduateToEdit.picture) setStudentPreview(graduateToEdit.picture);
            if (graduateToEdit.alumniPicture) setAlumniPreview(graduateToEdit.alumniPicture);
        }
    }, [graduateToEdit, initialDarsProgress]);


    const [errors, setErrors] = useState<Partial<Omit<Graduate, 'id'>>>({});
    const [studentPreview, setStudentPreview] = useState<string | null>(null);
    const [alumniPreview, setAlumniPreview] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'student' | 'alumni') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                if (type === 'student') {
                    setStudentPreview(result);
                    setFormData(prev => ({ ...prev, picture: result }));
                } else {
                    setAlumniPreview(result);
                    setFormData(prev => ({ ...prev, alumniPicture: result }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProgressChange = (classId: string) => {
        setFormData(prev => ({
            ...prev,
            darsENizamiProgress: {
                ...prev.darsENizamiProgress,
                [classId]: !prev.darsENizamiProgress![classId]
            }
        }));
    };
    
    const validate = () => {
        const newErrors: Partial<Omit<Graduate, 'id'>> = {};
        if (!formData.name.trim()) newErrors.name = 'Full name is required';
        if (!formData.fatherName.trim()) newErrors.fatherName = "Father's name is required";
        if (!formData.phone.trim()) newErrors.phone = 'Contact number is required';
        if (!formData.graduationDate) newErrors.graduationDate = 'Graduation date is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave({ ...formData, id: graduateToEdit?.id });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
            <div className="bg-surface rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-on-surface">{isEditing ? 'Edit Graduate' : 'Add New Graduate'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <fieldset className="border p-4 rounded-lg">
                        <legend className="px-2 font-semibold text-primary">Student Details</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                             <div>
                                <label htmlFor="name-alumni" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" name="name" id="name-alumni" value={formData.name} onChange={handleChange} className={`mt-1 block w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary`} required />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label htmlFor="bForm-alumni" className="block text-sm font-medium text-gray-700">B-Form Number (Optional)</label>
                                <input type="text" name="bForm" id="bForm-alumni" value={formData.bForm} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className="border p-4 rounded-lg">
                        <legend className="px-2 font-semibold text-primary">Guardian & Contact</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div>
                                <label htmlFor="fatherName-alumni" className="block text-sm font-medium text-gray-700">Father's/Guardian's Name</label>
                                <input type="text" name="fatherName" id="fatherName-alumni" value={formData.fatherName} onChange={handleChange} className={`mt-1 block w-full p-2 border ${errors.fatherName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary`} required />
                                {errors.fatherName && <p className="text-red-500 text-xs mt-1">{errors.fatherName}</p>}
                            </div>
                            <div>
                                <label htmlFor="fatherCnic-alumni" className="block text-sm font-medium text-gray-700">Father's CNIC (Optional)</label>
                                <input type="text" name="fatherCnic" id="fatherCnic-alumni" value={formData.fatherCnic} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="phone-alumni" className="block text-sm font-medium text-gray-700">Contact/Phone Number</label>
                                <input type="tel" name="phone" id="phone-alumni" value={formData.phone} onChange={handleChange} className={`mt-1 block w-full p-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary`} required />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>
                            <div className="md:col-span-2">
                                 <label htmlFor="address-alumni" className="block text-sm font-medium text-gray-700">Current Address (Optional)</label>
                                 <textarea name="address" id="address-alumni" value={formData.address} onChange={handleChange} rows={2} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"></textarea>
                            </div>
                        </div>
                    </fieldset>
                    
                     <fieldset className="border p-4 rounded-lg">
                        <legend className="px-2 font-semibold text-primary">Pictures</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Student Picture</label>
                                 <div className="mt-1 flex items-center gap-4">
                                     {studentPreview ? <img src={studentPreview} alt="Preview" className="w-16 h-16 rounded-full object-cover" /> : <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400"><PhotographIcon className="w-8 h-8"/></div>}
                                     <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'student')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                                 </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Graduation Picture</label>
                                 <div className="mt-1 flex items-center gap-4">
                                     {alumniPreview ? <img src={alumniPreview} alt="Preview" className="w-16 h-16 rounded-full object-cover" /> : <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400"><PhotographIcon className="w-8 h-8"/></div>}
                                     <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'alumni')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                                 </div>
                            </div>
                        </div>
                    </fieldset>
                    
                    <fieldset className="border p-4 rounded-lg">
                        <legend className="px-2 font-semibold text-primary">Graduation Details</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                             <div>
                                <label htmlFor="graduationDate" className="block text-sm font-medium text-gray-700">Graduation Date</label>
                                <input type="date" name="graduationDate" id="graduationDate" value={formData.graduationDate} onChange={handleChange} className={`mt-1 w-full p-2 border ${errors.graduationDate ? 'border-red-500' : 'border-gray-300'} rounded-md`} required/>
                                {errors.graduationDate && <p className="text-red-500 text-xs mt-1">{errors.graduationDate}</p>}
                            </div>
                            <div>
                                <label htmlFor="degreeCompleted" className="block text-sm font-medium text-gray-700">Degree Completed</label>
                                <select name="degreeCompleted" id="degreeCompleted" value={formData.degreeCompleted} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                                    <option value={AcademicTrack.DarsENizami}>Dars-e-Nizami</option>
                                    <option value={AcademicTrack.Hifz}>Hifz</option>
                                </select>
                            </div>
                        </div>
                    </fieldset>

                    {formData.degreeCompleted === AcademicTrack.DarsENizami ? (
                        <fieldset className="border p-4 rounded-lg">
                            <legend className="px-2 font-semibold text-primary">Dars-e-Nizami Progress</legend>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 my-2">
                                {darsENizamiClasses.map(cls => (
                                    <label key={cls.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-sky-50 cursor-pointer">
                                        <input type="checkbox" checked={formData.darsENizamiProgress![cls.id]} onChange={() => handleProgressChange(cls.id)} className="h-4 w-4 rounded text-primary focus:ring-primary"/>
                                        <span className="text-sm">{cls.name}</span>
                                    </label>
                                ))}
                            </div>
                            <label htmlFor="darsENizamiSanadStatus" className="block text-sm font-medium text-gray-700 mt-4">Sanad/Certificate Status</label>
                            <select name="darsENizamiSanadStatus" id="darsENizamiSanadStatus" value={formData.darsENizamiSanadStatus} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                                {Object.values(SanadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </fieldset>
                    ) : (
                         <fieldset className="border p-4 rounded-lg">
                            <legend className="px-2 font-semibold text-primary">Hifz Progress</legend>
                            <label htmlFor="hifzSanadStatus" className="block text-sm font-medium text-gray-700">Certificate Status</label>
                            <select name="hifzSanadStatus" id="hifzSanadStatus" value={formData.hifzSanadStatus} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                                 {Object.values(SanadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </fieldset>
                    )}
                    
                    <div className="flex justify-end gap-4 pt-4 border-t mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark">{isEditing ? 'Save Changes' : 'Save Graduate'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddGraduateModal;