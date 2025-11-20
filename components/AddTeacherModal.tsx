import React, { useState, useEffect } from 'react';
import { Teacher } from '../types';
import { PhotographIcon } from './Icons';

interface AddTeacherModalProps {
    onClose: () => void;
    onSave: (teacher: Omit<Teacher, 'id' | 'timetable'> & { id?: string }) => void;
    teacherToEdit?: Teacher | null;
}

const AddTeacherModal: React.FC<AddTeacherModalProps> = ({ onClose, onSave, teacherToEdit }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const isEditing = !!teacherToEdit;

    const [formData, setFormData] = useState<Omit<Teacher, 'id' | 'timetable'>>({
        name: '',
        contact: '',
        qualifications: '',
        picture: '',
    });

    useEffect(() => {
        if (teacherToEdit) {
            setFormData(teacherToEdit);
            if (teacherToEdit.picture) {
                setPreview(teacherToEdit.picture);
            }
        }
    }, [teacherToEdit]);

    const [errors, setErrors] = useState<Partial<typeof formData>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        const newErrors: Partial<typeof formData> = {};
        if (!formData.name.trim()) newErrors.name = 'Full name is required';
        if (!formData.contact.trim()) newErrors.contact = 'Contact number is required';
        if (!formData.qualifications.trim()) newErrors.qualifications = 'Qualifications are required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave({ ...formData, id: teacherToEdit?.id });
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
                className="bg-surface rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto m-4"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-on-surface">{isEditing ? 'Edit Teacher' : 'Add New Teacher'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none" aria-label="Close modal">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={`mt-1 block w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary`} required />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Number</label>
                        <input type="tel" name="contact" id="contact" value={formData.contact} onChange={handleChange} className={`mt-1 block w-full p-2 border ${errors.contact ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary`} required />
                        {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
                    </div>
                    <div>
                        <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700">Qualifications</label>
                        <textarea name="qualifications" id="qualifications" value={formData.qualifications} onChange={handleChange} rows={3} className={`mt-1 block w-full p-2 border ${errors.qualifications ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-primary focus:border-primary`} required></textarea>
                        {errors.qualifications && <p className="text-red-500 text-xs mt-1">{errors.qualifications}</p>}
                    </div>
                    <div>
                        <label htmlFor="picture" className="block text-sm font-medium text-gray-700">Teacher's Picture</label>
                        <div className="mt-1 flex items-center gap-4">
                            {preview ? (
                                <img src={preview} alt="Teacher preview" className="w-16 h-16 rounded-full object-cover" />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                    <PhotographIcon className="w-8 h-8"/>
                                </div>
                            )}
                            <input type="file" name="picture" id="picture" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Leave blank for an auto-generated image.</p>
                    </div>
                    <div className="flex justify-end gap-4 pt-4 border-t mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark">{isEditing ? 'Save Changes' : 'Save Teacher'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTeacherModal;