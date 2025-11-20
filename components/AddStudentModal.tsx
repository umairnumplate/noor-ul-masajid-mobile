import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Student } from '../types';
import { PhotographIcon } from './Icons';

interface AddStudentModalProps {
    onClose: () => void;
    onSave: (student: Omit<Student, 'id'> & { id?: string }) => void;
    studentToEdit?: Student | null;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ onClose, onSave, studentToEdit }) => {
    const { classes } = useAppContext();
    const [preview, setPreview] = useState<string | null>(null);
    const isEditing = !!studentToEdit;

    const [formData, setFormData] = useState<Omit<Student, 'id'>>({
        name: '',
        bForm: '',
        fatherName: '',
        fatherCnic: '',
        address: '',
        phone: '',
        classId: classes[0]?.id || '',
        picture: '',
    });
    
    useEffect(() => {
        if (studentToEdit) {
            setFormData(studentToEdit);
            if (studentToEdit.picture) {
                setPreview(studentToEdit.picture);
            }
        }
    }, [studentToEdit]);

    const [errors, setErrors] = useState<Partial<Omit<Student, 'id'>>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setPreview(result);
                setFormData(prev => ({ ...prev, picture: result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validate = () => {
        const newErrors: Partial<Omit<Student, 'id'>> = {};
        if (!formData.name.trim()) newErrors.name = 'Full name is required';
        if (!formData.fatherName.trim()) newErrors.fatherName = "Father's name is required";
        if (!formData.phone.trim()) newErrors.phone = 'Contact number is required';
        if (!formData.classId) newErrors.classId = 'Please select a class';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave({ ...formData, id: studentToEdit?.id });
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-surface rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-on-surface">{isEditing ? 'Edit Student' : 'Add New Student'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none" aria-label="Close modal">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <fieldset className="border p-4 rounded-lg">
                        <legend className="px-2 font-semibold text-primary">Student Details</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                             <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={`mt-1 block w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary`} required />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label htmlFor="classId" className="block text-sm font-medium text-gray-700">Class/Level</label>
                                <select name="classId" id="classId" value={formData.classId} onChange={handleChange} className={`mt-1 block w-full p-2 border ${errors.classId ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary`} required>
                                    <option value="" disabled>Select a class</option>
                                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                {errors.classId && <p className="text-red-500 text-xs mt-1">{errors.classId}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="bForm" className="block text-sm font-medium text-gray-700">B-Form Number (Optional)</label>
                                <input type="text" name="bForm" id="bForm" value={formData.bForm} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className="border p-4 rounded-lg">
                        <legend className="px-2 font-semibold text-primary">Guardian & Contact</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div>
                                <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700">Father's/Guardian's Name</label>
                                <input type="text" name="fatherName" id="fatherName" value={formData.fatherName} onChange={handleChange} className={`mt-1 block w-full p-2 border ${errors.fatherName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary`} required />
                                {errors.fatherName && <p className="text-red-500 text-xs mt-1">{errors.fatherName}</p>}
                            </div>
                            <div>
                                <label htmlFor="fatherCnic" className="block text-sm font-medium text-gray-700">Father's CNIC (Optional)</label>
                                <input type="text" name="fatherCnic" id="fatherCnic" value={formData.fatherCnic} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Contact/Phone Number</label>
                                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className={`mt-1 block w-full p-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary`} required />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>
                            <div className="md:col-span-2">
                                 <label htmlFor="address" className="block text-sm font-medium text-gray-700">Current Address (Optional)</label>
                                 <textarea name="address" id="address" value={formData.address} onChange={handleChange} rows={2} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"></textarea>
                            </div>
                        </div>
                    </fieldset>
                    
                    <fieldset className="border p-4 rounded-lg">
                         <legend className="px-2 font-semibold text-primary">Picture</legend>
                         <div className="mt-2">
                            <label htmlFor="picture" className="block text-sm font-medium text-gray-700">Student's Picture</label>
                            <div className="mt-1 flex items-center gap-4">
                                {preview ? (
                                    <img src={preview} alt="Student preview" className="w-16 h-16 rounded-full object-cover" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                        <PhotographIcon className="w-8 h-8"/>
                                    </div>
                                )}
                                <input type="file" name="picture" id="picture" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Leave blank for an auto-generated image.</p>
                        </div>
                    </fieldset>
                    
                    <div className="flex justify-end gap-4 pt-4 border-t mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark">{isEditing ? 'Save Changes' : 'Save Student'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudentModal;